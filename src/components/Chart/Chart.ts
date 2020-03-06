/**
 * Chart component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import ResizeObserver from 'resize-observer-polyfill';

export default function Chart(vido, props = {}) {
  const { api, state, onDestroy, Actions, update, html, StyleMap, createComponent } = vido;
  const componentName = 'chart';

  const ChartCalendarComponent = state.get('config.components.ChartCalendar');
  const ChartTimelineComponent = state.get('config.components.ChartTimeline');

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.Chart', value => (wrapper = value)));

  const Calendar = createComponent(ChartCalendarComponent);
  onDestroy(Calendar.destroy);
  const Timeline = createComponent(ChartTimelineComponent);
  onDestroy(Timeline.destroy);

  let className, classNameScroll, classNameScrollInner, scrollElement, scrollInnerElement;
  const componentActions = api.getActions(componentName);

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameScroll = api.getClass('horizontal-scroll');
      classNameScrollInner = api.getClass('horizontal-scroll-inner');
      update();
    })
  );

  onDestroy(
    state.subscribeAll(
      ['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'],
      function horizontalScroll() {
        if (scrollElement) scrollElement.style.width = state.get('_internal.chart.dimensions.width') + 'px';
        if (scrollInnerElement)
          scrollInnerElement.style.width = state.get('_internal.chart.time.totalViewDurationPx') + 'px';
      }
    )
  );

  onDestroy(
    state.subscribe('config.scroll.left', left => {
      if (scrollElement) {
        scrollElement.scrollLeft = left;
      }
    })
  );

  function onScrollHandler(event: MouseEvent) {
    if (event.type === 'scroll') {
      // @ts-ignore
      const left = event.target.scrollLeft;
      state.update('config.scroll.left', left);
    }
  }

  const onScroll = {
    handleEvent: onScrollHandler,
    passive: true,
    capture: false
  };

  function onWheelHandler(event: WheelEvent) {
    if (event.type === 'wheel') {
      const wheel = api.normalizeMouseWheelEvent(event);
      const xMultiplier = state.get('config.scroll.xMultiplier');
      const yMultiplier = state.get('config.scroll.yMultiplier');
      const currentScrollLeft = state.get('config.scroll.left');
      const totalViewDurationPx = state.get('_internal.chart.time.totalViewDurationPx');
      if (event.shiftKey && wheel.y) {
        const newScrollLeft = api.limitScrollLeft(
          totalViewDurationPx,
          chartWidth,
          currentScrollLeft + wheel.y * xMultiplier
        );
        state.update('config.scroll.left', newScrollLeft); // will trigger scrollbar to move which will trigger scroll event
      } else if (event.ctrlKey && wheel.y) {
        event.preventDefault();
        state.update('config.chart.time.zoom', currentZoom => {
          if (wheel.y < 0) {
            return currentZoom - 1;
          }
          return currentZoom + 1;
        });
      } else if (wheel.x) {
        const currentScrollLeft = state.get('config.scroll.left');
        state.update(
          'config.scroll.left',
          api.limitScrollLeft(totalViewDurationPx, chartWidth, currentScrollLeft + wheel.x * xMultiplier)
        );
      } else {
        state.update('config.scroll.top', top => {
          const rowsHeight = state.get('_internal.list.rowsHeight');
          const internalHeight = state.get('_internal.height');
          return api.limitScrollTop(rowsHeight, internalHeight, (top += wheel.y * yMultiplier));
        });
      }
    }
  }

  const onWheel = {
    handleEvent: onWheelHandler,
    passive: false,
    capture: false
  };

  function bindElement(element) {
    if (!scrollElement) {
      scrollElement = element;
      state.update('_internal.elements.horizontal-scroll', element);
    }
  }

  function bindInnerScroll(element) {
    scrollInnerElement = element;
    const old = state.get('_internal.elements.horizontal-scroll-inner');
    if (old !== element) state.update('_internal.elements.horizontal-scroll-inner', element);
    if (!state.get('_internal.loaded.horizontal-scroll-inner'))
      state.update('_internal.loaded.horizontal-scroll-inner', true);
  }

  let chartWidth = 0;
  let ro;
  componentActions.push(function bindElement(element) {
    if (!ro) {
      ro = new ResizeObserver((entries, observer) => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        const innerWidth = width - state.get('_internal.scrollBarHeight');
        if (chartWidth !== width) {
          chartWidth = width;
          state.update('_internal.chart.dimensions', { width, innerWidth, height });
        }
      });
      ro.observe(element);
      state.update('_internal.elements.chart', element);
      state.update('_internal.loaded.chart', true);
    }
  });

  onDestroy(() => {
    ro.disconnect();
  });

  const actions = Actions.create(componentActions, { api, state });
  const scrollActions = Actions.create([bindElement]);
  const scrollAreaActions = Actions.create([bindInnerScroll]);

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions} @wheel=${onWheel} @scroll=${onScroll}>
          ${Calendar.html()}${Timeline.html()}
          <div class=${classNameScroll} data-actions=${scrollActions} @scroll=${onScroll}>
            <div class=${classNameScrollInner} style="height: 1px" data-actions=${scrollAreaActions} />
          </div>
        </div>
      `,
      { vido, props: {}, templateProps }
    );
}
