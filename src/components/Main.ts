/**
 * Main component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import ResizeObserver from 'resize-observer-polyfill';

export default function Main(vido, props = {}) {
  const { api, state, onDestroy, Actions, update, createComponent, html, StyleMap, schedule } = vido;
  const componentName = api.name;

  let ListComponent;
  onDestroy(state.subscribe('config.components.List', value => (ListComponent = value)));
  let ChartComponent;
  onDestroy(state.subscribe('config.components.Chart', value => (ChartComponent = value)));

  const List = createComponent(ListComponent);
  onDestroy(List.destroy);
  const Chart = createComponent(ChartComponent);
  onDestroy(Chart.destroy);

  onDestroy(
    state.subscribe('config.plugins', plugins => {
      if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
        for (const plugin of plugins) {
          const destroyPlugin = plugin(vido);
          if (typeof destroyPlugin === 'function') {
            onDestroy(destroyPlugin);
          }
        }
      }
    })
  );

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.Main', value => (wrapper = value)));

  const componentActions = api.getActions('');
  let className,
    classNameVerticalScroll,
    styleMap = new StyleMap({}),
    verticalScrollStyleMap = new StyleMap({}),
    verticalScrollAreaStyleMap = new StyleMap({});
  let verticalScrollBarElement;
  let rowsHeight = 0;
  let resizerActive = false;

  /**
   * Update class names
   * @param {object} classNames
   */
  const updateClassNames = classNames => {
    const config = state.get('config');
    className = api.getClass(componentName, { config });
    if (resizerActive) {
      className += ` ${componentName}__list-column-header-resizer--active`;
    }
    classNameVerticalScroll = api.getClass('vertical-scroll', { config });
    update();
  };
  onDestroy(state.subscribe('config.classNames', updateClassNames));

  /**
   * Height change
   */
  function heightChange() {
    const config = state.get('config');
    const scrollBarHeight = state.get('_internal.scrollBarHeight');
    const height = config.height - config.headerHeight - scrollBarHeight;
    state.update('_internal.height', height);
    styleMap.style['--height'] = config.height + 'px';
    verticalScrollStyleMap.style.height = height + 'px';
    verticalScrollStyleMap.style.width = scrollBarHeight + 'px';
    verticalScrollStyleMap.style['margin-top'] = config.headerHeight + 'px';
    update();
  }
  onDestroy(state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], heightChange));

  /**
   * Resizer active change
   * @param {boolean} active
   */
  function resizerActiveChange(active) {
    resizerActive = active;
    className = api.getClass(api.name);
    if (resizerActive) {
      className += ` ${api.name}__list-column-header-resizer--active`;
    }
    update();
  }
  onDestroy(state.subscribe('_internal.list.columns.resizer.active', resizerActiveChange));

  /**
   * Generate tree
   * @param {object} bulk
   * @param {object} eventInfo
   */
  function generateTree(bulk, eventInfo) {
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
  }

  onDestroy(
    state.subscribeAll(
      ['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'],
      generateTree,
      { bulk: true }
    )
  );

  /**
   * Prepare expanded
   */
  function prepareExpanded() {
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
  }
  onDestroy(state.subscribeAll(['config.list.rows.*.expanded', '_internal.treeMap;'], prepareExpanded, { bulk: true }));

  /**
   * Generate visible rows
   */
  function generateVisibleRows() {
    const { visibleRows, compensation } = api.getVisibleRowsAndCompensation(
      state.get('_internal.list.rowsWithParentsExpanded')
    );
    const current = state.get('_internal.list.visibleRows');
    let shouldUpdate = true;
    state.update('config.scroll.compensation', -compensation);
    if (visibleRows.length) {
      shouldUpdate = visibleRows.some((row, index) => {
        if (typeof current[index] === 'undefined') {
          return true;
        }
        return row.id !== current[index].id;
      });
    }
    if (shouldUpdate) {
      state.update('_internal.list.visibleRows', visibleRows);
      const visibleItems = [];
      for (const row of visibleRows) {
        for (const item of row._internal.items) {
          visibleItems.push(item);
        }
      }
      state.update('_internal.chart.visibleItems', visibleItems);
    }
    update();
  }
  onDestroy(state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], generateVisibleRows));

  let elementScrollTop = 0;
  /**
   * On visible rows change
   */
  function onVisibleRowsChange() {
    const top = state.get('config.scroll.top');
    verticalScrollAreaStyleMap.style.width = '1px';
    verticalScrollAreaStyleMap.style.height = rowsHeight + 'px';
    if (elementScrollTop !== top && verticalScrollBarElement) {
      elementScrollTop = top;
      verticalScrollBarElement.scrollTop = top;
    }
    update();
  }
  onDestroy(state.subscribe('_internal.list.visibleRows;', onVisibleRowsChange));

  /**
   * Generate and add period dates
   * @param {string} period
   * @param {object} internalTime
   */
  const generateAndAddPeriodDates = (period, internalTime) => {
    const dates = [];
    let leftGlobal = internalTime.leftGlobal;
    const rightGlobal = internalTime.rightGlobal;
    const timePerPixel = internalTime.timePerPixel;
    let sub = leftGlobal - api.time.date(leftGlobal).startOf(period);
    let subPx = sub / timePerPixel;
    let leftPx = 0;
    let maxWidth = 0;
    while (leftGlobal < rightGlobal) {
      const date = {
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
      maxWidth = date.width > maxWidth ? date.width : maxWidth;
      date.leftPx = leftPx;
      leftPx += date.width;
      date.rightPx = leftPx;
      dates.push(date);
      leftGlobal = date.rightGlobal + 1;
      sub = 0;
      subPx = 0;
    }
    internalTime.maxWidth[period] = maxWidth;
    internalTime.dates[period] = dates;
  };

  /**
   * Recalculate times action
   */
  const recalculateTimes = () => {
    const chartWidth = state.get('_internal.chart.dimensions.width');
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
    const pixelGlobal = Math.round(time.rightGlobal / time.timePerPixel);
    const pixelTo = Math.round(time.to / time.timePerPixel);
    if (pixelGlobal > pixelTo) {
      const diff = time.rightGlobal - time.to;
      const diffPercent = diff / (time.rightGlobal - time.from);
      time.timePerPixel = time.timePerPixel - time.timePerPixel * diffPercent;
      time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
      time.rightGlobal = time.to;
      time.rightInner = time.rightGlobal - time.from;
      time.totalViewDurationMs = time.to - time.from;
      time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
      time.rightInner = time.rightGlobal - time.from;
      time.rightPx = time.rightInner / time.timePerPixel;
      time.leftPx = time.leftInner / time.timePerPixel;
    }
    generateAndAddPeriodDates('day', time);
    generateAndAddPeriodDates('month', time);
    state.update(`_internal.chart.time`, time);
    update();
  };
  onDestroy(
    state.subscribeAll(
      [
        'config.chart.time',
        '_internal.dimensions.width',
        'config.scroll.left',
        '_internal.scrollBarHeight',
        '_internal.list.width',
        '_internal.chart.dimensions'
      ],
      schedule(recalculateTimes),
      { bulk: true }
    )
  );

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  function renderIcon(html: string) {
    return new Promise(resolve => {
      const img = document.createElement('img');
      img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(html));
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
    });
  }

  async function renderIcons() {
    const icons = state.get('config.list.expander.icons');
    const rendered = {};
    for (const iconName in icons) {
      const html = icons[iconName];
      rendered[iconName] = await renderIcon(html);
    }
    state.update('_internal.list.expander.icons', rendered);
  }
  renderIcons();

  state.update('_internal.scrollBarHeight', api.getScrollBarHeight());

  let scrollTop = 0;

  /**
   * Handle scroll Event
   * @param {MouseEvent} event
   */
  function handleEvent(event: MouseEvent) {
    //event.stopPropagation();
    if (event.type === 'scroll') {
      // @ts-ignore
      const top = event.target.scrollTop;
      /**
       * Handle on scroll event
       * @param {object} scroll
       * @returns {object} scroll
       */
      const handleOnScroll = scroll => {
        scroll.top = top;
        scrollTop = scroll.top;
        const scrollInner = state.get('_internal.elements.vertical-scroll-inner');
        if (scrollInner) {
          const scrollHeight = scrollInner.clientHeight;
          scroll.percent.top = scroll.top / scrollHeight;
        }
        return scroll;
      };
      if (scrollTop !== top)
        state.update('config.scroll', handleOnScroll, {
          only: ['top', 'percent.top']
        });
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      const xMultiplier = state.get('config.scroll.xMultiplier');
      const yMultiplier = state.get('config.scroll.yMultiplier');
      if (event.shiftKey && wheel.y) {
        state.update('config.scroll.left', left => {
          return api.limitScroll('left', (left += wheel.y * xMultiplier));
        });
      } else if (wheel.x) {
        state.update('config.scroll.left', left => {
          return api.limitScroll('left', (left += wheel.x * xMultiplier));
        });
      } else {
        state.update('config.scroll.top', top => {
          return (scrollTop = api.limitScroll('top', (top += wheel.y * yMultiplier)));
        });
      }
    }
  }

  const onScroll = {
    handleEvent: handleEvent,
    passive: true,
    capture: false
  };

  /**
   * Stop scroll / wheel to sink into parent elements
   * @param {Event} event
   */
  function onScrollStop(event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  const dimensions = { width: 0, height: 0 };
  let ro;
  /**
   * Resize action
   * @param {Element} element
   */
  class ResizeAction {
    constructor(element: HTMLElement) {
      if (!ro) {
        ro = new ResizeObserver((entries, observer) => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          if (dimensions.width !== width || dimensions.height !== height) {
            dimensions.width = width;
            dimensions.height = height;
            state.update('_internal.dimensions', dimensions);
          }
        });
        ro.observe(element);
        state.update('_internal.elements.main', element);
      }
    }
    update() {}
    destroy(element) {
      ro.unobserve(element);
    }
  }
  if (!componentActions.includes(ResizeAction)) {
    componentActions.push(ResizeAction);
  }

  onDestroy(() => {
    ro.disconnect();
  });

  /**
   * Bind scroll element
   * @param {Element} element
   */
  const bindScrollElement = (element: Element) => {
    if (!verticalScrollBarElement) {
      verticalScrollBarElement = element;
      state.update('_internal.elements.vertical-scroll', element);
    }
  };

  /**
   * Bind scroll inner element
   * @param {Element} element
   */
  const bindScrollInnerElement = (element: Element) => {
    state.update('_internal.elements.vertical-scroll-inner', element);
  };

  const actionProps = { ...props, api, state };
  const mainActions = Actions.create(componentActions, actionProps);
  const verticalScrollActions = Actions.create([bindScrollElement]);
  const verticalScrollAreaActions = Actions.create([bindScrollInnerElement]);

  return templateProps =>
    wrapper(
      html`
        <div
          data-info-url="https://github.com/neuronetio/gantt-schedule-timeline-calendar"
          class=${className}
          style=${styleMap}
          @scroll=${onScrollStop}
          @wheel=${onScrollStop}
          data-actions=${mainActions}
        >
          ${List.html()}${Chart.html()}
          <div
            class=${classNameVerticalScroll}
            style=${verticalScrollStyleMap}
            @scroll=${onScroll}
            @wheel=${onScroll}
            data-action=${verticalScrollActions}
          >
            <div style=${verticalScrollAreaStyleMap} data-actions=${verticalScrollAreaActions} />
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
