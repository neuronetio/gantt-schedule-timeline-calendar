/**
 * ChartCalendarDate component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartCalendarDate(vido, props) {
  const { api, state, onDestroy, actions, update, onChange, html } = vido;

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

  let time, htmlFormatted, display, style;

  function updateDate() {
    time = state.get('_internal.chart.time');
    style = `width: ${props.date.width}px; margin-left:-${props.date.subPx}px;`;
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
      case 'year':
        htmlFormatted = html`
          <div class=${className + '-content ' + className + '-content--year' + current}>${dateMod.format('YYYY')}</div>
        `;
        if (maxWidth <= 100) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--year' + current}>${dateMod.format('YY')}</div>
          `;
        }
        break;
      case 'month':
        htmlFormatted = html`
          <div
            class=${className + '-content ' + className + '-content--month' + current}
            style="margin-left:${props.date.subPx + 8}px;"
          >
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
          <div class=${className + '-content ' + className + '-content--day' + current}>${dateMod.format('DD')}</div>
          <div class=${className + '-content ' + className + '-content--day-word' + current}>
            ${dateMod.format('dddd')}
          </div>
        `;
        if (maxWidth <= 40) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day' + current}>
              <div class=${className + '-content ' + className + '-content--day-small' + current}>
                ${dateMod.format('DD')} ${dateMod.format('ddd')}
              </div>
            </div>
          `;
        } else if (maxWidth <= 50) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day' + current}>${dateMod.format('DD')}</div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('dd')}
            </div>
          `;
        } else if (maxWidth <= 90) {
          htmlFormatted = html`
            <div class=${className + '-content ' + className + '-content--day' + current}>${dateMod.format('DD')}</div>
            <div class=${className + '-content ' + className + '-content--day-word' + current}>
              ${dateMod.format('ddd')}
            </div>
          `;
        }
        break;
    }
    update();
  }

  let timeSub;
  onChange(changedProps => {
    props = changedProps;
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

  return templateProps =>
    wrapper(
      html`
        <div
          class=${className + ' ' + className + '--' + props.period + current}
          style=${style}
          data-actions=${actions(componentActions, { date: props.date, period: props.period, api, state })}
        >
          ${htmlFormatted}
        </div>
      `,
      { props, vido, templateProps }
    );
}
