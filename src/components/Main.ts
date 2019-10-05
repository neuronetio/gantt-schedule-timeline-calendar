import Example from './Example';
export default function Main(input = {}) {
  return core => {
    const componentName = core.api.name;

    let className;
    core.onDestroy(
      core.state.subscribe('classNames', () => {
        className = core.api.getClass(componentName);
        core.render();
      })
    );
    const example = core.createComponent(Example());
    core.onDestroy(example.destroy);

    return props => core.html`<div class="${className}">Main ${example.html()}</div>`;
  };
}

//import List from './List/List.svelte';
//import Chart from './Chart/Chart.svelte';
/*
  let plugins,
    pluginsPath = 'config.plugins';
  onDestroy(
    state.subscribe(pluginsPath, plugins => {
      if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
        for (const plugin of plugins) {
          plugin(state, api);
        }
      }
    })
  );

  const action = api.getAction('');
  let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
  let verticalScrollBarElement;
  let expandedHeight = 0;
  let resizerActive = false;

  onDestroy(
    state.subscribe('config.classNames', classNames => {
      const config = state.get('config');
      className = api.getClass(api.name, { config });
      if (resizerActive) {
        className += ` ${api.name}__list-column-header-resizer--active`;
      }
      classNameVerticalScroll = api.getClass('vertical-scroll', { config });
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
    })
  );

  onDestroy(
    state.subscribe('_internal.list.columns.resizer.active', active => {
      resizerActive = active;
      className = api.getClass(api.name);
      if (resizerActive) {
        className += ` ${api.name}__list-column-header-resizer--active`;
      }
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
        expandedHeight = api.getRowsHeight(rowsWithParentsExpanded);
        state.update('_internal.list.expandedHeight', expandedHeight);
        state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
      },
      { bulk: true }
    )
  );

  onDestroy(
    state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
      const visibleRows = api.getVisibleRows(state.get('_internal.list.rowsWithParentsExpanded'));
      state.update('_internal.list.visibleRows', visibleRows);
    })
  );

  onDestroy(
    state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
      const top = state.get('config.scroll.top');
      styleVerticalScrollArea = `height: ${expandedHeight}px; width: 1px`;
      if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
        verticalScrollBarElement.scrollTop = top;
      }
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
          .valueOf()
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
        state.update('_internal.chart.dimensions', { width: chartWidth, innerWidth: chartInnerWidth });
        let time = api.mergeDeep({}, state.get('config.chart.time'));
        time = api.time.recalculateFromTo(time);
        const zoomPercent = time.zoom * 0.01;
        let scrollLeft = state.get('config.scroll.left');
        let oldScrollPercentage = 0;
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
          console.log(
            'right global > time.to',
            api.time.date(time.rightGlobal).format('YYYY-MM-DD'),
            api.time.date(time.to).format('YYYY-MM-DD'),
            (time.rightGlobal - time.to) / time.timePerPixel,
            time.totalViewDurationPx
          );
          time.rightGlobal = time.to;
          time.rightInner = time.rightGlobal - time.from;
          time.totalViewDurationMs = time.to - time.from;
          time.totalViewDurationPx = time.rightPx;
          time.timePerPixel = time.totalViewDurationMs / time.totalViewDurationPx;
          console.log(
            'after recalculation',
            api.time.date(time.rightGlobal).format('YYYY-MM-DD'),
            api.time.date(time.to).format('YYYY-MM-DD'),
            (time.rightGlobal - time.to) / time.timePerPixel,
            time.totalViewDurationPx
          );
        }
        generateAndAddDates(time, chartWidth);
        state.update(`_internal.chart.time`, time);
      }
    )
  );

  onMount(() => {
    state.update('_internal.scrollBarHeight', api.getScrollBarHeight());
  });

  let dimensions = { width: 0, height: 0 };
  let dims = { width: 0, height: 0 };
  $: if (dims.width !== dimensions.width || dims.height !== dimensions.height) {
    dims = { ...dimensions };
    state.update('_internal.dimensions', () => dims);
    state.update('_internal.scrollBarHeight', api.getScrollBarHeight());
  }

  function onScroll(event) {
    state.update('config.scroll.top', event.target.scrollTop);
  }
</script>

<svelte:options accessors={true} tag="gantt-shedule-timeline-calendar" />
<div
  class={className}
  use:action={{ state, api }}
  {style}
  bind:clientWidth={dimensions.width}
  bind:clientHeight={dimensions.height}>
  <List />
  <Chart />
  <div
    class={classNameVerticalScroll}
    style={styleVerticalScroll}
    on:scroll={onScroll}
    bind:this={verticalScrollBarElement}>
    <div style={styleVerticalScrollArea} />
  </div>
</div>
*/
