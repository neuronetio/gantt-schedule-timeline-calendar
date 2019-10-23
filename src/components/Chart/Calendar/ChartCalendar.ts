/**
 * ChartCalendar component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ChartCalendar(vido) {
  const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;
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
      style = `height: ${headerHeight}px;`;
      update();
    })
  );

  let period;
  onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));

  let periodDates,
    periodDatesComponents = [];
  onDestroy(
    state.subscribe(`_internal.chart.time.dates.${period}`, value => {
      if (value) {
        periodDates = value;
        periodDatesComponents.forEach(date => date.component.destroy());
        periodDatesComponents = [];
        for (const date of periodDates) {
          periodDatesComponents.push({ id: date.id, component: createComponent(ChartCalendarDateComponent, { date }) });
        }
        update();
      }
    })
  );
  onDestroy(() => {
    periodDatesComponents.forEach(date => date.component.destroy());
  });

  componentActions.push(element => {
    state.update('_internal.elements.calendar', element);
  });

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions)} style=${style}>
          ${repeat(periodDatesComponents, d => d.id, d => d.component.html())}
        </div>
      `,
      { props: {}, vido, templateProps: props }
    );
}
