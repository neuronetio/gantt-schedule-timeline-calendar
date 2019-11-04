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

  let className,
    formattedClassName,
    formattedYearClassName,
    formattedMonthClassName,
    formattedDayClassName,
    formattedDayWordClassName;

  let current = api.time.date().format('YYYY-MM-DD');

  function updateClassNames() {
    current = api.time.date().format('YYYY-MM-DD');
    className = api.getClass(componentName, props);
    if (api.time.date(props.date.leftGlobal).format('YYYY-MM-DD') === api.time.date().format('YYYY-MM-DD')) {
      className += ' current';
    }
    if (
      api.time
        .date(props.date.leftGlobal)
        .subtract(1, 'day')
        .format('YYYY-MM-DD') === current
    ) {
      className += ' next';
    }
    if (
      api.time
        .date(props.date.leftGlobal)
        .add(1, 'day')
        .format('YYYY-MM-DD') === current
    ) {
      className += ' previous';
    }
    formattedClassName = api.getClass(`${componentName}-formatted`, props);
    formattedYearClassName = api.getClass(`${componentName}-formatted-year`, props);
    formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, props);
    formattedDayClassName = api.getClass(`${componentName}-formatted-day`, props);
    formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, props);
    update();
  }

  let classNamesSub = state.subscribe('config.classNames', updateClassNames);

  function updateDate() {
    time = state.get('_internal.chart.time');
    daySize = time.zoom <= 22 ? 18 : 13;
    const dateMod = api.time.date(props.date.leftGlobal);
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
    style = `width: ${props.date.width}px; margin-left:-${props.date.subPx}px; --day-size: ${daySize}px`;
    update();
  }

  let time, small, smallFormatted, year, month, day, dayWord, style, daySize;
  let timeSub;
  onChange(changedProps => {
    props = changedProps;
    if (classNamesSub) {
      classNamesSub();
    }
    classNamesSub = state.subscribe('config.classNames', updateClassNames);
    if (timeSub) {
      timeSub();
    }
    timeSub = state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'], updateDate, {
      bulk: true
    });
  });

  onDestroy(() => {
    classNamesSub();
    timeSub();
  });

  return templateProps =>
    wrapper(
      html`
        <div
          class=${className}
          style=${style}
          data-actions=${actions(componentActions, { date: props.date, api, state })}
        >
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
      { props, vido, templateProps }
    );
}
