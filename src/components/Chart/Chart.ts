import CalendarComponent from './Calendar/Calendar';
import GanttComponent from './Gantt/Gantt';

export default function Chart(vido) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'chart';

  const Calendar = createComponent(CalendarComponent);
  onDestroy(Calendar.destroy);
  const Gantt = createComponent(GanttComponent);
  onDestroy(Gantt.destroy);

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

  const onScroll = {
    handleEvent(event) {
      let scrollLeft;
      if (event.type === 'scroll') {
        state.update('config.scroll.left', event.target.scrollLeft);
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
            return api.limitScroll('top', (top += wheel.y * yMultiplier));
          });
        }
      }
      const chart = state.get('_internal.elements.chart');
      const scrollInner = state.get('_internal.elements.horizontalScrollInner');
      if (chart) {
        const scrollLeft = state.get('config.scroll.left');
        const percent = Math.round((scrollLeft / (scrollInner.clientWidth - chart.clientWidth)) * 100);
        console.log(percent);
        state.update('config.scroll.percent.left', percent);
      }
    },
    passive: true
  };

  const bindElement = {
    create(element) {
      scrollElement = element;
      state.update('_internal.elements.horizontalScroll', element);
    }
  };

  const bindInnerScroll = {
    create(element) {
      state.update('_internal.elements.horizontalScrollInner', element);
    }
  };

  componentActions.push({
    create(element) {
      state.update('_internal.elements.chart', element);
    }
  });

  return props => html`
    <div class=${className} data-actions=${actions(componentActions, { api, state })} @wheel=${onScroll}>
      ${Calendar.html()}${Gantt.html()}
      <div class=${classNameScroll} style=${styleScroll} data-actions=${actions([bindElement])} @scroll=${onScroll}>
        <div class=${classNameScrollInner} style=${styleScrollInner} data-actions=${actions([bindInnerScroll])} />
      </div>
    </div>
  `;
}
