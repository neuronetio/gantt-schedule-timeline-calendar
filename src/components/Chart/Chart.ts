/**
 * Chart component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import ResizeObserver from 'resize-observer-polyfill';
import schedule from 'raf-schd';
export default function Chart(vido, props = {}) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'chart';

  const ChartCalendarComponent = state.get('config.components.ChartCalendar');
  const ChartTimelineComponent = state.get('config.components.ChartTimeline');

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.Chart', value => (wrapper = value)));

  const Calendar = createComponent(ChartCalendarComponent);
  onDestroy(Calendar.destroy);
  const Timeline = createComponent(ChartTimelineComponent);
  onDestroy(Timeline.destroy);

  let className,
    classNameScroll,
    classNameScrollInner,
    scrollElement,
    styleScroll = '',
    styleScrollInner = '',
    componentActions = api.getActions(componentName);

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameScroll = api.getClass('horizontal-scroll');
      classNameScrollInner = api.getClass('horizontal-scroll-inner');
      update();
    })
  );
  onDestroy(
    state.subscribe('config.scroll.left', left => {
      if (scrollElement && scrollElement.scrollLeft !== left) {
        scrollElement.scrollLeft = left;
      }
      update();
    })
  );

  onDestroy(
    state.subscribeAll(
      ['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'],
      function horizontalScroll(value, eventInfo) {
        styleScroll = `width: ${state.get('_internal.chart.dimensions.width')}px`;
        styleScrollInner = `width: ${state.get('_internal.chart.time.totalViewDurationPx')}px; height:1px`;
        update();
      }
    )
  );

  function handleEvent(event) {
    let scrollLeft, scrollTop;
    if (event.type === 'scroll') {
      state.update('config.scroll.left', event.target.scrollLeft);
      scrollLeft = event.target.scrollLeft;
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      const xMultiplier = state.get('config.scroll.xMultiplier');
      const yMultiplier = state.get('config.scroll.yMultiplier');
      if (event.shiftKey && wheel.y) {
        state.update('config.scroll.left', left => {
          return (scrollLeft = api.limitScroll('left', (left += wheel.y * xMultiplier)));
        });
      } else if (wheel.x) {
        state.update('config.scroll.left', left => {
          return (scrollLeft = api.limitScroll('left', (left += wheel.x * xMultiplier)));
        });
      } else {
        state.update('config.scroll.top', top => {
          return (scrollTop = api.limitScroll('top', (top += wheel.y * yMultiplier)));
        });
      }
    }
    const chart = state.get('_internal.elements.chart');
    const scrollInner = state.get('_internal.elements.horizontal-scroll-inner');
    if (chart) {
      const scrollLeft = state.get('config.scroll.left');
      let percent = 0;
      if (scrollLeft) {
        percent = Math.round((scrollLeft / (scrollInner.clientWidth - chart.clientWidth)) * 100);
        if (percent > 100) percent = 100;
      }
      state.update('config.scroll.percent.left', percent);
    }
  }

  const onScroll = {
    handleEvent: schedule(handleEvent),
    passive: true,
    capture: false
  };

  const onWheel = {
    handleEvent,
    passive: true,
    capture: false
  };

  function bindElement(element) {
    if (!scrollElement) {
      scrollElement = element;
      state.update('_internal.elements.horizontal-scroll', element);
    }
  }

  function bindInnerScroll(element) {
    state.update('_internal.elements.horizontal-scroll-inner', element);
  }

  let chartWidth = 0;
  let ro;
  componentActions.push(element => {
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
    }
  });

  onDestroy(() => {
    ro.disconnect();
  });

  return function updateTemplate(templateProps) {
    return wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { api, state })} @wheel=${onWheel}>
          ${Calendar.html()}${Timeline.html()}
          <div class=${classNameScroll} style=${styleScroll} data-actions=${actions([bindElement])} @scroll=${onScroll}>
            <div class=${classNameScrollInner} style=${styleScrollInner} data-actions=${actions([bindInnerScroll])} />
          </div>
        </div>
      `,
      { vido, props: {}, templateProps }
    );
  };
}
