/**
 * ChartCalendar component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartCalendar(vido, props) {
  const { api, state, onDestroy, actions, update, reuseComponents, html, repeat } = vido;
  const componentName = 'chart-calendar';
  const componentActions = api.getActions(componentName);

  const ChartCalendarDateComponent = state.get('config.components.ChartCalendarDate');

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartCalendar', value => (wrapper = value)));

  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      update();
    })
  );

  let headerHeight,
    style = '';
  onDestroy(
    state.subscribe('config.headerHeight', value => {
      headerHeight = value;
      style = `height: ${headerHeight}px;--calendar-height: ${headerHeight}px`;
      update();
    })
  );

  let period;
  onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));

  let dayComponents = [],
    monthComponents = [],
    yearComponents = [];
  onDestroy(
    state.subscribe(`_internal.chart.time.dates`, dates => {
      const currentDate = api.time.date().format('YYYY-MM-DD');
      if (typeof dates.day === 'object' && Array.isArray(dates.day) && dates.day.length) {
        reuseComponents(
          dayComponents,
          dates.day,
          date => date && { period: 'day', date, currentDate },
          ChartCalendarDateComponent
        );
      }
      if (typeof dates.month === 'object' && Array.isArray(dates.month) && dates.month.length) {
        reuseComponents(
          monthComponents,
          dates.month,
          date => date && { period: 'month', date, currentDate },
          ChartCalendarDateComponent
        );
      }
      update();
    })
  );
  onDestroy(() => {
    dayComponents.forEach(c => c.destroy());
  });

  componentActions.push(element => {
    state.update('_internal.elements.calendar', element);
  });

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { ...props, api, state })} style=${style}>
          <div class=${className + '-dates ' + className + '-dates--months'}>${monthComponents.map(m => m.html())}</div>
          <div class=${className + '-dates ' + className + '-dates--days'}>${dayComponents.map(d => d.html())}</div>
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
