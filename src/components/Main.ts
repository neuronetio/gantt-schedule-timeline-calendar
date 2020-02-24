/**
 * Main component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import ResizeObserver from 'resize-observer-polyfill';

export default function Main(vido, props = {}) {
  const { api, state, onDestroy, Actions, update, createComponent, html, StyleMap, schedule } = vido;
  const componentName = api.name;

  // Initialize plugins
  onDestroy(
    state.subscribe('config.plugins', plugins => {
      if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
        for (const initializePlugin of plugins) {
          const destroyPlugin = initializePlugin(vido);
          if (typeof destroyPlugin === 'function') {
            onDestroy(destroyPlugin);
          } else if (destroyPlugin && destroyPlugin.hasOwnProperty('destroy')) {
            destroyPlugin.destroy();
          }
        }
      }
    })
  );

  const componentSubs = [];
  let ListComponent;
  componentSubs.push(state.subscribe('config.components.List', value => (ListComponent = value)));
  let ChartComponent;
  componentSubs.push(state.subscribe('config.components.Chart', value => (ChartComponent = value)));

  const List = createComponent(ListComponent);
  onDestroy(List.destroy);
  const Chart = createComponent(ChartComponent);
  onDestroy(Chart.destroy);

  onDestroy(() => {
    componentSubs.forEach(unsub => unsub());
  });

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.Main', value => (wrapper = value)));

  const componentActions = api.getActions('main');
  let className, classNameVerticalScroll;
  const styleMap = new StyleMap({}),
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
    const flatTreeMapById = api.getFlatTreeMapById(treeMap);
    state.update('_internal.flatTreeMapById', flatTreeMapById);
    const flatTreeMap = api.flattenTreeMap(treeMap);
    state.update('_internal.flatTreeMap', flatTreeMap);
    update();
  }

  onDestroy(state.subscribeAll(['config.list.rows;', 'config.chart.items;'], generateTree));
  onDestroy(
    state.subscribeAll(['config.list.rows.*.parentId', 'config.chart.items.*.rowId'], generateTree, { bulk: true })
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
  function generateVisibleRowsAndItems() {
    const { visibleRows, compensation } = api.getVisibleRowsAndCompensation(
      state.get('_internal.list.rowsWithParentsExpanded')
    );
    const smoothScroll = state.get('config.scroll.smooth');
    const currentVisibleRows = state.get('_internal.list.visibleRows');
    let shouldUpdate = true;
    state.update('config.scroll.compensation.y', smoothScroll ? -compensation : 0);
    if (visibleRows.length !== currentVisibleRows.length) {
      shouldUpdate = true;
    } else if (visibleRows.length) {
      shouldUpdate = visibleRows.some((row, index) => {
        if (typeof currentVisibleRows[index] === 'undefined') {
          return true;
        }
        return row.id !== currentVisibleRows[index].id;
      });
    }
    if (shouldUpdate) {
      state.update('_internal.list.visibleRows', visibleRows);
    }
    const visibleItems = [];
    for (const row of visibleRows) {
      for (const item of row._internal.items) {
        visibleItems.push(item);
      }
    }
    state.update('_internal.chart.visibleItems', visibleItems);
    update();
  }
  onDestroy(
    state.subscribeAll(
      ['_internal.list.rowsWithParentsExpanded;', 'config.scroll.top', 'config.chart.items'],
      generateVisibleRowsAndItems,
      { bulk: true }
    )
  );

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
  const generateAndAddPeriodDates = (period: string, internalTime) => {
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
  function recalculateTimes() {
    const chartWidth = state.get('_internal.chart.dimensions.width');
    let time = api.mergeDeep({}, state.get('config.chart.time'));
    time = api.time.recalculateFromTo(time);
    let scrollLeft = state.get('config.scroll.left');
    time.timePerPixel = Math.pow(2, time.zoom);
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
    const rightPixelGlobal = Math.round(time.rightGlobal / time.timePerPixel);
    const pixelTo = Math.round(time.to / time.timePerPixel);
    if (rightPixelGlobal > pixelTo && scrollLeft === 0) {
      const diff = time.rightGlobal - time.to;
      const diffPercent = diff / (time.rightGlobal - time.from);
      time.timePerPixel = time.timePerPixel - time.timePerPixel * diffPercent;
      time.zoom = Math.log(time.timePerPixel) / Math.log(2);
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
    let xCompensation = 0;
    if (time.dates.day && time.dates.day.length !== 0) {
      xCompensation = time.dates.day[0].subPx;
    }
    state.update('config.scroll.compensation.x', xCompensation);
    update();
  }
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

  if (
    state.get('config.usageStatistics') === true &&
    location.port === '' &&
    location.host !== '' &&
    !location.host.startsWith('localhost')
  ) {
    try {
      const oReq = new XMLHttpRequest();
      oReq.open('POST', 'https://gstc-us.neuronet.io/');
      oReq.send(JSON.stringify({ location: { href: location.href, host: location.host } }));
    } catch (e) {}
  }

  let scrollTop = 0;

  /**
   * Handle scroll Event
   * @param {MouseEvent} event
   */
  function handleEvent(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
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
    handleEvent,
    passive: false,
    capture: false
  };

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
    public update() {}
    public destroy(element) {
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
   * @param {HTMLElement} element
   */
  function bindScrollElement(element: HTMLElement) {
    if (!verticalScrollBarElement) {
      verticalScrollBarElement = element;
      state.update('_internal.elements.vertical-scroll', element);
    }
  }

  /**
   * Bind scroll inner element
   * @param {Element} element
   */
  function bindScrollInnerElement(element: Element) {
    state.update('_internal.elements.vertical-scroll-inner', element);
  }

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
          @scroll=${onScroll}
          @wheel=${onScroll}
          data-actions=${mainActions}
        >
          ${List.html()}${Chart.html()}
          <div
            class=${classNameVerticalScroll}
            style=${verticalScrollStyleMap}
            @scroll=${onScroll}
            @wheel=${onScroll}
            data-actions=${verticalScrollActions}
          >
            <div style=${verticalScrollAreaStyleMap} data-actions=${verticalScrollAreaActions} />
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
