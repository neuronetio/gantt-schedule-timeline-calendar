function generateVariant(globalTime, currentTime, api) {
  const period = globalTime.period;
  const date = api.time.date(currentTime.left);
  let year = date.format('YYYY');
  let month = date.format('MMMM');
  let day = date.format('DD');
  let dayWord = date.format('dddd');
  const maxWidth = globalTime.maxWidth;
  if (maxWidth <= 40) {
    return `<div class="${api.getClass('chart-calendar-date', {
      currentTime,
      period
    })}"><div class="${api.getClass('chart-calendar-date-formatted', { currentTime, period })}" title="${date.format(
      'dddd DD MMM YYYY'
    )}" style="width: ${currentTime.width}px; transform: rotate(90deg)">${date.format('YYYY-MM-DD')}</div></div>`;
  }
  if (maxWidth <= 70) {
    year = date.format('YY');
    month = date.format('MMM');
    day = date.format('DD');
    dayWord = date.format('ddd');
  } else if (maxWidth <= 150) {
    dayWord = date.format('ddd');
  }
  return `<div class="${api.getClass('chart-calendar-date', {
    currentTime,
    period
  })}"><div class="${api.getClass('chart-calendar-date-formatted', { currentTime, period })}" title="${date.format(
    'dddd DD MMM YYYY'
  )}" style="width: ${currentTime.width}px">
      <div class="${api.getClass('chart-calendar-date-formatted-year', { currentTime, period })}">${year}</div>
      <div class="${api.getClass('chart-calendar-date-formatted-month', { currentTime, period })}">${month}</div>
      <div class="${api.getClass('chart-calendar-date-formatted-day', { currentTime, period })}">${day}</div>
      <div class="${api.getClass('chart-calendar-date-formatted-day-word', {
        currentTime,
        period
      })}">${dayWord}</div>
      </div>
    </div>`;
}

export const verticalCalendar = function verticalCalendarPlugin(options) {
  function calendarAction(node, data) {
    const subscribers = [];
    const state = data.state;
    const api = data.api;

    let time;
    subscribers.push(
      state.subscribe('_internal.chart.time', value => {
        time = value;
        node.innerHTML = time.dates.map(currentTime => generateVariant(time, currentTime, api)).join('');
      })
    );

    return {
      update(data) {},
      destroy() {
        subscribers.forEach(unsubscribe => unsubscribe());
      }
    };
  }

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-calendar', actions => {
      if (!actions.includes(calendarAction)) {
        actions.push(calendarAction);
      }
      return actions;
    });
  };
};
export default verticalCalendar;
