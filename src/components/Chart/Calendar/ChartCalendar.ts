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
  const { api, state, onDestroy, Actions, update, reuseComponents, html, StyleMap } = vido;
  const componentName = 'chart-calendar';
  const componentActions = api.getActions(componentName);
  const actionProps = { ...props, api, state };

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
    styleMap = new StyleMap({ height: '', '--headerHeight': '' });
  onDestroy(
    state.subscribe('config.headerHeight', value => {
      headerHeight = value;
      styleMap.style['height'] = headerHeight + 'px';
      styleMap.style['--calendar-height'] = headerHeight + 'px';
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
    state.update('_internal.elements.chart-calendar', element);
  });

  let slots;
  onDestroy(api.subscribeSlots('chart-calendar', value => (slots = value), props));

  const actions = Actions.create(componentActions, actionProps);
  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions} style=${styleMap}>
          ${slots.get('before')}
          <div class=${className + '-dates ' + className + '-dates--months'}>${monthComponents.map(m => m.html())}</div>
          <div class=${className + '-dates ' + className + '-dates--days'}>${dayComponents.map(d => d.html())}</div>
          ${slots.get('after')}
        </div>
      `,
      { props, vido, templateProps }
    );
}
