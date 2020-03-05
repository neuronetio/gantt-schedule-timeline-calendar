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
import { ChartCalendarAdditionalSpace, ChartTime, ChartInternalTime } from '../types';

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
    api.prepareItems(items);
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
  onDestroy(
    state.subscribeAll(
      ['config.list.rows.*.expanded', '_internal.treeMap;', 'config.list.rows.*.height'],
      prepareExpanded,
      { bulk: true }
    )
  );

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
  const generatePeriodDates = (period: string, internalTime) => {
    const dates = [];
    let leftGlobal = internalTime.leftGlobal;
    const timePerPixel = internalTime.timePerPixel;
    let startOfLeft = api.time
      .date(leftGlobal)
      .startOf(period)
      .valueOf();
    if (startOfLeft < leftGlobal) startOfLeft = leftGlobal;
    let sub = leftGlobal - startOfLeft;
    let subPx = sub / timePerPixel;
    let leftPx = 0;
    let maxWidth = 0;
    const diff = Math.ceil(
      api.time
        .date(internalTime.rightGlobal)
        .endOf(period)
        .diff(api.time.date(leftGlobal).startOf(period), period, true)
    );
    for (let i = 0; i < diff; i++) {
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
        rightPx: 0,
        period
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
    return dates;
  };

  function triggerLoadedEvent() {
    if (state.get('_internal.loadedEventTriggered')) return;
    Promise.resolve().then(() => {
      const element = state.get('_internal.elements.main');
      const parent = element.parentNode;
      const event = new Event('gstc-loaded');
      element.dispatchEvent(event);
      parent.dispatchEvent(event);
    });
    state.update('_internal.loadedEventTriggered', true);
  }

  function expand(time, scrollLeft) {
    const diff = time.rightGlobal - time.to;
    const diffPercent = diff / (time.rightGlobal - time.from);
    time.timePerPixel = time.timePerPixel - time.timePerPixel * diffPercent;
    time.zoom = Math.log(time.timePerPixel) / Math.log(2);
    time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
    time.rightGlobal = time.to;
    time.rightInner = time.rightGlobal - time.from;
    time.totalViewDurationMs = time.to - time.from;
    time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
    //addAdditionalSpace(time, calendar.addAdditionalSpace);
    time.rightInner = time.rightGlobal - time.from;
    time.rightPx = time.rightInner / time.timePerPixel;
    time.leftPx = time.leftInner / time.timePerPixel;
  }

  function getLevels(time, calendar) {
    time.levels = [];
    let index = 0;
    for (const level of calendar.levels) {
      const formatting = level.formats.find(format => +time.zoom <= +format.zoomTo);
      if (level.main) {
        time.format = formatting;
        time.level = index;
      }
      if (formatting) {
        time.levels.push(generatePeriodDates(formatting.period, time));
      }
      index++;
    }
  }

  let working = false;
  function recalculateTimes(reason) {
    if (working) return;
    working = true;
    const configTime = state.get('config.chart.time');
    const chartWidth = state.get('_internal.chart.dimensions.width');
    const calendar = state.get('config.chart.calendar');
    const oldTime = { ...state.get('_internal.chart.time') };
    let time = api.mergeDeep({}, configTime);
    if ((!time.from || !time.to) && !Object.keys(state.get('config.chart.items')).length) {
      return;
    }
    let mainLevel = calendar.levels.find(level => level.main);
    if (!mainLevel) {
      throw new Error('Main calendar level not found (config.chart.calendar.levels).');
    }
    if (time.period !== oldTime.period) {
      let periodFormat = mainLevel.formats.find(format => format.period === time.period && format.default);
      if (periodFormat) {
        time.zoom = periodFormat.zoomTo;
        time.additionalSpaceProcessed = false;
      }
    }
    for (const level of calendar.levels) {
      const formatting = level.formats.find(format => +time.zoom <= +format.zoomTo);
      if (level.main) {
        time.period = formatting.period;
      }
    }

    time = api.time.recalculateFromTo(time, calendar);
    time.timePerPixel = Math.pow(2, time.zoom);
    time.totalViewDurationMs = api.time.date(time.to).diff(time.from, 'milliseconds');
    time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
    let scrollLeft = state.get('config.scroll.left');

    // If time.zoom (or time.period) has been changed
    // then we need to recalculate basing on time.centerGlobal
    // and update scroll left
    // if not then we need to calculate from scroll left

    if (time.zoom !== oldTime.zoom && oldTime.centerGlobal) {
      const chartWidthInMs = chartWidth * time.timePerPixel;
      const halfChartInMs = Math.round(chartWidthInMs / 2);
      time.leftGlobal = oldTime.centerGlobal - halfChartInMs;
      time.rightGlobal = time.leftGlobal + chartWidthInMs;
      time.centerGlobal = time.leftGlobal + Math.round((time.rightGlobal - time.leftGlobal) / 2);
      scrollLeft = Math.round((time.leftGlobal - time.from) / time.timePerPixel);
      scrollLeft = api.limitScroll('left', scrollLeft);
    } else {
      time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
      time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
      time.centerGlobal = time.leftGlobal + Math.round((time.rightGlobal - time.leftGlobal) / 2);
    }

    time.leftInner = time.leftGlobal - time.from;
    time.rightInner = time.rightGlobal - time.from;
    time.leftPx = time.leftInner / time.timePerPixel;
    time.rightPx = time.rightInner / time.timePerPixel;

    const rightPixelGlobal = Math.round(time.rightGlobal / time.timePerPixel);
    const pixelTo = Math.round(time.to / time.timePerPixel);
    if (calendar.expand && rightPixelGlobal > pixelTo && scrollLeft === 0) {
      //expand(time, scrollLeft);
    }
    getLevels(time, calendar);
    let xCompensation = 0;
    if (time.levels[time.level] && time.levels[time.level].length !== 0) {
      xCompensation = time.levels[time.level][0].subPx;
    }
    state.update(`_internal.chart.time`, { ...time });
    state.update('config.scroll.compensation.x', xCompensation);
    state.update('config.chart.time.zoom', time.zoom);
    state.update('config.chart.time.period', time.format.period);
    state.update('config.scroll.left', scrollLeft);
    update().then(() => {
      if (!state.get('_internal.loaded.time')) {
        state.update('_internal.loaded.time', true);
      }
    });
    working = false;
  }

  const recalculationTriggerCache = {
    initialized: false,
    zoom: 0,
    period: '',
    scrollLeft: 0,
    chartWidth: 0
  };
  function recalculationIsNeeded() {
    const configTime = state.get('config.chart.time');
    const scrollLeft = state.get('config.scroll.left');
    const chartWidth = state.get('_internal.chart.dimensions.width');
    const cache = { ...recalculationTriggerCache };
    recalculationTriggerCache.zoom = configTime.zoom;
    recalculationTriggerCache.period = configTime.period;
    recalculationTriggerCache.scrollLeft = scrollLeft;
    recalculationTriggerCache.chartWidth = chartWidth;
    if (!recalculationTriggerCache.initialized) {
      recalculationTriggerCache.initialized = true;
      return 'all';
    }
    if (configTime.zoom !== cache.zoom) return { name: 'zoom', oldValue: cache.zoom, newValue: configTime.zoom };
    if (configTime.period !== cache.period)
      return { name: 'period', oldValue: cache.period, newValue: configTime.period };
    if (scrollLeft !== cache.scrollLeft) return { name: 'scroll', oldValue: cache.scrollLeft, newValue: scrollLeft };
    if (chartWidth !== cache.chartWidth)
      return { name: 'chartWidth', oldValue: cache.chartWidth, newValue: chartWidth };
    return false;
  }

  onDestroy(
    state.subscribeAll(
      [
        'config.chart.time',
        'config.chart.calendar.levels',
        'config.scroll.left',
        '_internal.list.width',
        '_internal.chart.dimensions.width'
      ],
      () => {
        let reason = recalculationIsNeeded();
        if (reason) recalculateTimes(reason);
      },
      { bulk: true }
    )
  );

  // When time.from and time.to is not specified and items are reloaded;
  // check if item is outside current time scope and extend it if needed
  onDestroy(
    state.subscribe('config.chart.items;', items => {
      const configTime = state.get('config.chart.time');
      if (configTime.from !== 0 && configTime.to !== 0) return;
      const internalTime = state.get('_internal.chart.time');
      for (const itemId in items) {
        const item = items[itemId];
        if (item.time.start < internalTime.from || item.time.end > internalTime.to) {
          recalculateTimes('items');
        }
      }
    })
  );

  if (
    state.get('config.usageStatistics') === true &&
    location.port === '' &&
    location.host !== '' &&
    !location.host.startsWith('localhost') &&
    !location.host.startsWith('127.') &&
    !location.host.startsWith('192.') &&
    !location.host.endsWith('.test') &&
    !location.host.endsWith('.local')
  ) {
    try {
      const oReq = new XMLHttpRequest();
      oReq.open('POST', 'https://gstc-us.neuronet.io/');
      oReq.send(JSON.stringify({ location: { href: location.href, host: location.host } }));
    } catch (e) {}
  }

  let scrollTop = 0;
  let propagate = true;
  onDestroy(state.subscribe('config.scroll.propagate', prpgt => (propagate = prpgt)));

  /**
   * Handle scroll Event
   * @param {MouseEvent} event
   */
  function handleEvent(event: MouseEvent) {
    if (!propagate) {
      event.stopPropagation();
      event.preventDefault();
    }
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

  onDestroy(
    state.subscribeAll(['_internal.loaded', '_internal.chart.time.totalViewDurationPx'], () => {
      if (state.get('_internal.loadedEventTriggered')) return;
      const loaded = state.get('_internal.loaded');
      if (loaded.main && loaded.chart && loaded.time && loaded['horizontal-scroll-inner']) {
        const scroll = state.get('_internal.elements.horizontal-scroll-inner');
        const width = state.get('_internal.chart.time.totalViewDurationPx');
        if (scroll && scroll.clientWidth === Math.round(width)) {
          setTimeout(triggerLoadedEvent, 0);
        }
      }
    })
  );

  function LoadedEventAction() {
    state.update('_internal.loaded.main', true);
  }
  if (!componentActions.includes(LoadedEventAction)) componentActions.push(LoadedEventAction);

  /**
   * Bind scroll inner element
   * @param {Element} element
   */
  function bindScrollInnerElement(element: Element) {
    if (!state.get('_internal.elements.vertical-scroll-inner'))
      state.update('_internal.elements.vertical-scroll-inner', element);
    if (!state.get('_internal.loaded.vertical-scroll-inner'))
      state.update('_internal.loaded.vertical-scroll-inner', true);
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
