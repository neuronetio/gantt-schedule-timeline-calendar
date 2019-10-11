import ResizeObserver from 'resize-observer-polyfill';
import ListComponent from './List/List';
import ChartComponent from './Chart/Chart';

export default function Main(vido) {
  const { api, state, onDestroy, actions, update, createComponent, html } = vido;
  const componentName = api.name;

  const List = createComponent(ListComponent);
  onDestroy(List.destroy);
  const Chart = createComponent(ChartComponent);
  onDestroy(Chart.destroy);

  onDestroy(
    state.subscribe('config.plugins', plugins => {
      if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
        for (const plugin of plugins) {
          plugin(state, api);
        }
      }
    })
  );

  const componentActions = api.getActions('');
  let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
  let verticalScrollBarElement;
  let rowsHeight = 0;
  let resizerActive = false;

  onDestroy(
    state.subscribe('config.classNames', classNames => {
      const config = state.get('config');
      className = api.getClass(componentName, { config });
      if (resizerActive) {
        className += ` ${componentName}__list-column-header-resizer--active`;
      }
      classNameVerticalScroll = api.getClass('vertical-scroll', { config });
      update();
    })
  );

  onDestroy(
    state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], () => {
      const config = state.get('config');
      const scrollBarHeight = state.get('_internal.scrollBarHeight');
      const height = config.height - config.headerHeight - scrollBarHeight;
      state.update('_internal.height', height);
      style = `--height: ${config.height}px`;
      styleVerticalScroll = `height: ${height}px; width: ${scrollBarHeight}px; margin-top: ${config.headerHeight}px;`;
      update();
    })
  );

  onDestroy(
    state.subscribe('_internal.list.columns.resizer.active', active => {
      resizerActive = active;
      className = api.getClass(api.name);
      if (resizerActive) {
        className += ` ${api.name}__list-column-header-resizer--active`;
      }
      update();
    })
  );

  onDestroy(
    state.subscribeAll(
      ['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'],
      (bulk, eventInfo) => {
        if (state.get('_internal.flatTreeMap').length && eventInfo.type === 'subscribe') {
          return;
        }
        const configRows = state.get('config.list.rows');
        const rows = [];
        for (const rowId in configRows) {
          rows.push(configRows[rowId]);
        }
        api.fillEmptyRowValues(rows);
        const configItems = state.get('config.chart.items');
        const items = [];
        for (const itemId in configItems) {
          items.push(configItems[itemId]);
        }
        const treeMap = api.makeTreeMap(rows, items);
        state.update('_internal.treeMap', treeMap);
        state.update('_internal.flatTreeMapById', api.getFlatTreeMapById(treeMap));
        state.update('_internal.flatTreeMap', api.flattenTreeMap(treeMap));
        update();
      },
      { bulk: true }
    )
  );

  onDestroy(
    state.subscribeAll(
      ['config.list.rows.*.expanded', '_internal.treeMap;'],
      bulk => {
        const configRows = state.get('config.list.rows');
        const rowsWithParentsExpanded = api.getRowsFromIds(
          api.getRowsWithParentsExpanded(
            state.get('_internal.flatTreeMap'),
            state.get('_internal.flatTreeMapById'),
            configRows
          ),
          configRows
        );
        rowsHeight = api.getRowsHeight(rowsWithParentsExpanded);
        state.update('_internal.list.rowsHeight', rowsHeight);
        state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
        update();
      },
      { bulk: true }
    )
  );

  onDestroy(
    state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
      const visibleRows = api.getVisibleRows(state.get('_internal.list.rowsWithParentsExpanded'));
      state.update('_internal.list.visibleRows', visibleRows);
      update();
    })
  );

  onDestroy(
    state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
      const top = state.get('config.scroll.top');
      styleVerticalScrollArea = `height: ${rowsHeight}px; width: 1px`;
      if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
        verticalScrollBarElement.scrollTop = top;
      }
      update();
    })
  );

  function generateAndAddDates(internalTime, chartWidth) {
    const dates = [];
    let leftGlobal = internalTime.leftGlobal;
    const rightGlobal = internalTime.rightGlobal;
    const timePerPixel = internalTime.timePerPixel;
    const period = internalTime.period;
    let sub = leftGlobal - api.time.date(leftGlobal).startOf(period);
    let subPx = sub / timePerPixel;
    let leftPx = 0;
    let maxWidth = 0;
    let id = 0;
    while (leftGlobal < rightGlobal) {
      const date = {
        id: id++,
        sub,
        subPx,
        leftGlobal,
        rightGlobal: api.time
          .date(leftGlobal)
          .endOf(period)
          .valueOf(),
        width: 0,
        leftPx: 0,
        rightPx: 0
      };
      date.width = (date.rightGlobal - date.leftGlobal + sub) / timePerPixel;
      if (date.width > chartWidth) {
        date.width = chartWidth;
      }
      maxWidth = date.width > maxWidth ? date.width : maxWidth;
      date.leftPx = leftPx;
      leftPx += date.width;
      date.rightPx = leftPx;
      dates.push(date);
      leftGlobal = date.rightGlobal + 1;
      sub = 0;
      subPx = 0;
    }
    internalTime.maxWidth = maxWidth;
    internalTime.dates = dates;
  }

  onDestroy(
    state.subscribeAll(
      [
        'config.chart.time',
        '_internal.dimensions.width',
        'config.scroll.left',
        '_internal.scrollBarHeight',
        '_internal.list.width'
      ],
      function recalculateTimesAction() {
        const chartWidth = state.get('_internal.dimensions.width') - state.get('_internal.list.width');
        const chartInnerWidth = chartWidth - state.get('_internal.scrollBarHeight');
        const chartHeight = state.get('_internal.dimensions.height') - state.get('config.headerHeight');
        state.update('_internal.chart.dimensions', {
          width: chartWidth,
          innerWidth: chartInnerWidth,
          height: chartHeight
        });
        let time = api.mergeDeep({}, state.get('config.chart.time'));
        time = api.time.recalculateFromTo(time);
        const zoomPercent = time.zoom * 0.01;
        let scrollLeft = state.get('config.scroll.left');
        time.timePerPixel = zoomPercent + Math.pow(2, time.zoom);
        time.totalViewDurationMs = api.time.date(time.to).diff(time.from, 'milliseconds');
        time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
        if (scrollLeft > time.totalViewDurationPx) {
          scrollLeft = time.totalViewDurationPx - chartWidth;
        }
        time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
        time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
        time.leftInner = time.leftGlobal - time.from;
        time.rightInner = time.rightGlobal - time.from;
        time.leftPx = time.leftInner / time.timePerPixel;
        time.rightPx = time.rightInner / time.timePerPixel;
        if (Math.round(time.rightGlobal / time.timePerPixel) > Math.round(time.to / time.timePerPixel)) {
          time.rightGlobal = time.to;
          time.rightInner = time.rightGlobal - time.from;
          time.totalViewDurationMs = time.to - time.from;
          time.totalViewDurationPx = time.rightPx;
          time.timePerPixel = time.totalViewDurationMs / time.totalViewDurationPx;
        }
        generateAndAddDates(time, chartWidth);
        state.update(`_internal.chart.time`, time);
        update();
      }
    )
  );

  state.update('_internal.scrollBarHeight', api.getScrollBarHeight());

  const onScroll = {
    handleEvent(event) {
      state.update(
        'config.scroll',
        scroll => {
          scroll.top = event.target.scrollTop;
          const scrollHeight = state.get('_internal.elements.verticalScrollInner').clientHeight;
          scroll.percent.top = scroll.top / scrollHeight;
          return scroll;
        },
        { only: ['top', 'percent.top'] }
      );
    },
    passive: false
  };

  const dimensions = { width: 0, height: 0 };

  componentActions.push({
    create(element) {
      const ro = new ResizeObserver((entries, observer) => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (dimensions.width !== width || dimensions.height !== height) {
          dimensions.width = width;
          dimensions.height = height;
          state.update('_internal.dimensions', dimensions);
          state.update(
            'config.scroll',
            scroll => {
              scroll.left = (scroll.percent.left * scroll.left) / 100;
              return scroll;
            },
            { only: 'left' }
          );
        }
      });
      ro.observe(element);
      state.update('_internal.elements.main', element);
    }
  });

  const bindScrollElement = {
    create(element) {
      verticalScrollBarElement = element;
      state.update('_internal.elements.verticalScroll', element);
    }
  };
  const bindScrollInnerElement = {
    create(element) {
      state.update('_internal.elements.verticalScrollInner', element);
    }
  };

  return props =>
    html`
      <div class=${className} style=${style} @scroll=${onScroll} data-actions=${actions(componentActions)}>
        ${List.html()}${Chart.html()}
        <div
          class=${classNameVerticalScroll}
          style=${styleVerticalScroll}
          @scroll=${onScroll}
          data-action=${actions([bindScrollElement])}
        >
          <div style=${styleVerticalScrollArea} data-actions=${actions([bindScrollInnerElement])} />
        </div>
      </div>
    `;
}
