/**
 * ChartCalendarDate component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ChartCalendarDate(vido, { date }) {
  const { api, state, onDestroy, actions, update, html } = vido;

  const componentName = 'chart-calendar-date';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartCalendarDate', value => (wrapper = value)));

  let className,
    formattedClassName,
    formattedYearClassName,
    formattedMonthClassName,
    formattedDayClassName,
    formattedDayWordClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { date });
      if (api.time.date(date.leftGlobal).format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')) {
        className += ' current';
      }
      if (
        api.time
          .date(date.leftGlobal)
          .subtract(1, 'day')
          .format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')
      ) {
        className += ' next';
      }
      if (
        api.time
          .date(date.leftGlobal)
          .add(1, 'day')
          .format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')
      ) {
        className += ' previous';
      }
      formattedClassName = api.getClass(`${componentName}-formatted`, { date });
      formattedYearClassName = api.getClass(`${componentName}-formatted-year`, { date });
      formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, { date });
      formattedDayClassName = api.getClass(`${componentName}-formatted-day`, { date });
      formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, { date });
      update();
    })
  );

  let time, small, smallFormatted, year, month, day, dayWord, style, daySize;
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'],
      function updateDate() {
        time = state.get('_internal.chart.time');
        daySize = time.zoom <= 22 ? 18 : 13;
        const dateMod = api.time.date(date.leftGlobal);
        const maxWidth = time.maxWidth[time.period];
        small = maxWidth <= 40;
        const smallFormat = state.get('config.chart.calendar.vertical.smallFormat');
        smallFormatted = dateMod.format(smallFormat);
        year = dateMod.format('YYYY');
        month = dateMod.format('MMMM');
        day = dateMod.format('DD');
        dayWord = dateMod.format('dddd');
        if (maxWidth <= 70) {
          year = dateMod.format('YY');
          month = dateMod.format('MMM');
          day = dateMod.format('DD');
          dayWord = dateMod.format('ddd');
        } else if (maxWidth <= 150) {
          dayWord = dateMod.format('ddd');
        }
        style = `width: ${date.width}px; margin-left:-${date.subPx}px; --day-size: ${daySize}px`;
        update();
      },
      { bulk: true }
    )
  );

  return props =>
    wrapper(
      html`
        <div class=${className} style=${style} data-actions=${actions(componentActions, { date, api, state })}>
          ${small
            ? html`
                <div class=${formattedClassName} style="transform: rotate(90deg);">
                  ${smallFormatted}
                </div>
              `
            : html`
                <div class=${formattedClassName}>
                  <div class=${formattedYearClassName}>${year}</div>
                  <div class=${formattedMonthClassName}>${month}</div>
                  <div class=${formattedDayClassName}>${day}</div>
                  <div class=${formattedDayWordClassName}>${dayWord}</div>
                </div>
              `}
        </div>
      `,
      { props: {}, vido, templateProps: props }
    );
}
