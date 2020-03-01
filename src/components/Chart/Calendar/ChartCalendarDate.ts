/**
 * ChartCalendarDay component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import Action from '@neuronet.io/vido/Action';

/**
 * Save element
 * @param {HTMLElement} element
 * @param {object} data
 */
class BindElementAction extends Action {
  constructor(element, data) {
    super();
    data.state.update('_internal.elements.chart-calendar-dates', elements => {
      if (typeof elements === 'undefined') {
        elements = [];
      }
      if (!elements.includes(element)) {
        elements.push(element);
      }
      return elements;
    });
  }
}

export default function ChartCalendarDay(vido, props) {
  const { api, state, onDestroy, Actions, update, onChange, html, StyleMap, Detach } = vido;

  const componentName = 'chart-calendar-date';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartCalendarDate', value => (wrapper = value)));

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
    })
  );

  let current = '';
  let time, htmlFormatted;
  const styleMap = new StyleMap({ width: '', visibility: 'visible' }),
    scrollStyleMap = new StyleMap({
      overflow: 'hidden',
      'text-align': 'left'
    });

  let formatClassName = '';
  function updateDate() {
    if (!props) return;
    const cache = state.get('_internal.cache.calendar');
    const level = state.get(`config.chart.calendar.levels.${props.level}`);
    const useCache = false; //level.doNotUseCache ? false : true;
    styleMap.style.width = props.date.width + 'px';
    styleMap.style.visibility = 'visible';
    scrollStyleMap.style = { overflow: 'hidden', 'text-align': 'left', 'margin-left': props.date.subPx + 8 + 'px' };
    time = state.get('_internal.chart.time');
    const cacheKey = `${new Date(props.date.leftGlobal).toISOString()}-${props.date.period}-${props.level}-${
      time.zoom
    }`;
    if (!cache[cacheKey]) {
      cache[cacheKey] = {};
    }
    let timeStart, timeEnd;
    if (useCache && cache[cacheKey].timeStart) {
      timeStart = cache[cacheKey].timeStart;
      timeEnd = cache[cacheKey].timeEnd;
    } else {
      timeStart = api.time.date(props.date.leftGlobal);
      timeEnd = api.time.date(props.date.rightGlobal);
      cache[cacheKey].timeStart = timeStart;
      cache[cacheKey].timeEnd = timeEnd;
    }
    const formats = level.formats;
    const formatting = formats.find(formatting => +time.zoom <= +formatting.zoomTo);
    let format;
    if (useCache && cache[cacheKey].format) {
      format = cache[cacheKey].format;
    } else {
      format = formatting ? formatting.format({ timeStart, timeEnd, className, vido, props }) : null;
      cache[cacheKey].format = format;
    }
    if (useCache && cache[cacheKey].current) {
      current = cache[cacheKey].current;
    } else {
      if (timeStart.format(props.currentDateFormat) === props.currentDate) {
        current = ' current';
      } else if (timeStart.subtract(1, props.date.period).format(props.currentDateFormat) === props.currentDate) {
        current = ' next';
      } else if (timeStart.add(1, props.date.period).format(props.currentDateFormat) === props.currentDate) {
        current = ' previous';
      } else {
        current = '';
      }
      cache[cacheKey].current = current;
    }
    let finalClassName = className + '-content ' + className + `-content--${props.date.period}` + current;
    if (formatting.className) {
      finalClassName += ' ' + formatting.className;
      formatClassName = ' ' + formatting.className;
    } else {
      formatClassName = '';
    }
    // updating cache state is not necessary because it is object and nobody listen to cache
    htmlFormatted = html`
      <div class=${finalClassName}>
        ${format}
      </div>
    `;
    update();
  }

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  let timeSub;
  const actionProps = { date: props.date, period: props.period, api, state };
  onChange((changedProps, options) => {
    if (options.leave) {
      shouldDetach = true;
      return update();
    }
    shouldDetach = false;
    props = changedProps;
    actionProps.date = props.date;
    actionProps.period = props.period;
    if (timeSub) {
      timeSub();
    }
    timeSub = state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.levels'], updateDate, {
      bulk: true
    });
  });

  onDestroy(() => {
    timeSub();
  });

  if (!componentActions.includes(BindElementAction)) componentActions.push(BindElementAction);

  const actions = Actions.create(componentActions, actionProps);
  return templateProps =>
    wrapper(
      html`
        <div
          detach=${detach}
          class=${className + ' ' + className + `--${props.date.period}` + current + formatClassName}
          style=${styleMap}
          data-actions=${actions}
        >
          ${htmlFormatted}
        </div>
      `,
      { props, vido, templateProps }
    );
}
