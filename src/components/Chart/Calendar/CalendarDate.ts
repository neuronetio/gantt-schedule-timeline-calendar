export default function CalendarDate({ date }, vido) {
  const { api, state, onDestroy, actions, update, html } = vido;

  const componentName = 'chart-calendar-date';
  const componentActions = api.getActions(componentName);

  let className,
    formattedClassName,
    formattedYearClassName,
    formattedMonthClassName,
    formattedDayClassName,
    formattedDayWordClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { date });
      formattedClassName = api.getClass(`${componentName}-formatted`, { date });
      formattedYearClassName = api.getClass(`${componentName}-formatted-year`, { date });
      formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, { date });
      formattedDayClassName = api.getClass(`${componentName}-formatted-day`, { date });
      formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, { date });
      update();
    })
  );

  let time, period, small, smallFormatted, year, month, day, dayWord, style, daySize;
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'],
      function updateDate() {
        time = state.get('_internal.chart.time');
        daySize = time.zoom <= 22 ? 18 : 13;
        period = time.period;
        const dateMod = api.time.date(date.leftGlobal);
        const maxWidth = time.maxWidth;
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

  return props => html`
    <div class=${className} style=${style} data-actions=${actions(componentActions, { date, api, state })}>
      ${small
        ? html`
            <div class=${formattedClassName} style="transform: rotate(90deg);">${smallFormatted}</div>
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
  `;
}
