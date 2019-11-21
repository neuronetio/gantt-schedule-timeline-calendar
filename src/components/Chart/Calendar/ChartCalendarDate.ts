/**
 * ChartCalendarDate component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

/**
 * Save element
 * @param {HTMLElement} element
 * @param {object} data
 */
function saveElement(element, data) {
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

export default function ChartCalendarDate(vido, props) {
  const { api, state, onDestroy, Actions, update, onChange, html, StyleMap } = vido;

  const componentName = 'chart-calendar-date';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartCalendarDate', value => (wrapper = value)));

  let className = api.getClass(componentName, props);

  let current = '';
  if (api.time.date(props.date.leftGlobal).format('YYYY-MM-DD') === props.currentDate) {
    current = ' current';
  } else {
    current = '';
  }

  let time,
    htmlFormatted,
    styleMap = new StyleMap({ width: '', 'margin-left': '', visibility: 'visible' }),
    scrollStyleMap = new StyleMap({
      overflow: 'hidden',
      'text-align': 'left',
      'margin-left': props.date.subPx + 8 + 'px'
    });

  const updateDate = () => {
    if (!props) return;
    time = state.get('_internal.chart.time');
    styleMap.style.width = props.date.width + 'px';
    styleMap.style['margin-left'] = -props.date.subPx + 'px';
    styleMap.style.visibility = 'visible';
    scrollStyleMap.style = { overflow: 'hidden', 'text-align': 'left', 'margin-left': props.date.subPx + 8 + 'px' };
    const dateMod = api.time.date(props.date.leftGlobal);
    if (dateMod.format('YYYY-MM-DD') === props.currentDate) {
      current = ' current';
    } else if (dateMod.subtract(1, 'days').format('YYYY-MM-DD') === props.currentDate) {
      current = ' next';
    } else if (dateMod.add(1, 'days').format('YYYY-MM-DD') === props.currentDate) {
      current = ' previous';
    } else {
      current = '';
    }
    const maxWidth = time.maxWidth[props.period];
    switch (props.period) {
      case 'month':
        htmlFormatted = html`
          <div class=${className + '-content ' + className + '-content--month' + current} style=${scrollStyleMap}>
            ${dateMod.format('MMMM YYYY')}
          </div>
        `;
        if (maxWidth <= 100) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--month' + current}>
              ${dateMod.format("MMM'YY")}
            </div>
          `;
        }
        break;
      case 'day':
        htmlFormatted = html`
          <div class=${className + '-content ' + className + '-content--day _0' + current}>
            <div class=${className + '-content ' + className + '-content--day-small' + current}>
              ${dateMod.format('DD')} ${dateMod.format('ddd')}
            </div>
          </div>
        `;
        if (maxWidth >= 40 && maxWidth < 50) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _40' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('dd')}
            </div>
          `;
        } else if (maxWidth >= 50 && maxWidth < 90) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _50' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('ddd')}
            </div>
          `;
        } else if (maxWidth >= 90 && maxWidth < 180) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _90' + current}>
              ${dateMod.format('DD')}
            </div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('dddd')}
            </div>
          `;
        } else if (maxWidth >= 180 && maxWidth < 400) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 12; i++) {
            const left = start.add(i * 2, 'hours');
            const width =
              (start
                .add(i * 2 + 1, 'hours')
                .endOf('hour')
                .valueOf() -
                left.valueOf()) /
              time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH')
            });
          }
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _180' + current}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class="${className + '-content ' + className + '-content--hours-hour' + current}"
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        } else if (maxWidth >= 400 && maxWidth < 1000) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 24; i++) {
            const left = start.add(i, 'hours');
            const width =
              (start
                .add(i, 'hours')
                .endOf('hour')
                .valueOf() -
                left.valueOf()) /
              time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH')
            });
          }
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _400' + current}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        }
        // scroll day from now on
        else if (maxWidth >= 1000 && maxWidth < 2000) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 24; i++) {
            const left = start.add(i, 'hours');
            const width =
              (start
                .add(i, 'hours')
                .endOf('hour')
                .valueOf() -
                left.valueOf()) /
              time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH:mm')
            });
          }
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _1000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        } else if (maxWidth >= 2000 && maxWidth < 5000) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 24 * 2; i++) {
            const left = start.add(i * 30, 'minutes');
            const width = (start.add((i + 1) * 30, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH:mm')
            });
          }
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _2000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        } else if (maxWidth >= 5000 && maxWidth < 20000) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 24 * 4; i++) {
            const left = start.add(i * 15, 'minutes');
            const width = (start.add((i + 1) * 15, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH:mm')
            });
          }
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day _5000' + current} style=${scrollStyleMap}>
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        } else if (maxWidth >= 20000) {
          const hours = [];
          const start = dateMod.startOf('day');
          for (let i = 0; i < 24 * 12; i++) {
            const left = start.add(i * 5, 'minutes');
            const width = (start.add((i + 1) * 5, 'minutes').valueOf() - left.valueOf()) / time.timePerPixel;
            hours.push({
              width,
              formatted: left.format('HH:mm')
            });
          }
          htmlFormatted = html`
            <div
              class=${className + '-content ' + className + '-content--day _20000' + current}
              style=${scrollStyleMap}
            >
              ${dateMod.format('DD dddd')}
            </div>
            <div class=${className + '-content ' + className + '-content--hours' + current}>
              ${hours.map(
                hour =>
                  html`
                    <div
                      class=${className + '-content ' + className + '-content--hours-hour' + current}
                      style="width: ${hour.width}px"
                    >
                      ${hour.formatted}
                    </div>
                  `
              )}
            </div>
          `;
        }
        break;
    }
    update();
  };

  let timeSub;
  const actionProps = { date: props.date, period: props.period, api, state };
  onChange((changedProps, options) => {
    if (options.leave) {
      styleMap.style.visibility = 'hidden';
      return update();
    }
    props = changedProps;
    actionProps.date = props.date;
    actionProps.period = props.period;
    if (timeSub) {
      timeSub();
    }
    timeSub = state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'], updateDate, {
      bulk: true
    });
  });

  onDestroy(() => {
    timeSub();
  });

  if (!componentActions.includes(saveElement)) componentActions.push(saveElement);

  const actions = Actions.create(componentActions, actionProps);
  return templateProps =>
    wrapper(
      html`
        <div
          class=${className + ' ' + className + '--' + props.period + current}
          style=${styleMap}
          data-actions=${actions}
        >
          ${htmlFormatted}
        </div>
      `,
      { props, vido, templateProps }
    );
}
