/**
 * ChartCalendar component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
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

  let headerHeight;
  const styleMap = new StyleMap({ height: '', '--headerHeight': '', 'margin-left': '' });
  onDestroy(
    state.subscribe('config.headerHeight', value => {
      headerHeight = value;
      styleMap.style['height'] = headerHeight + 'px';
      styleMap.style['--calendar-height'] = headerHeight + 'px';
      update();
    })
  );

  onDestroy(
    state.subscribe('config.scroll.compensation.x', compensation => {
      styleMap.style['margin-left'] = -compensation + 'px';
      update();
    })
  );

  const components = [[], []];
  onDestroy(
    state.subscribe(`_internal.chart.time.levels`, levels => {
      const currentDate = api.time.date().format('YYYY-MM-DD');
      let level = 0;
      for (const dates of levels) {
        if (!dates.length) continue;
        let currentDateFormat = 'YYYY-MM-DD HH'; // hour
        switch (dates[0].period) {
          case 'day':
            currentDateFormat = 'YYYY-MM-DD';
            break;
          case 'week':
            currentDateFormat = 'YYYY-MM-ww';
            break;
          case 'month':
            currentDateFormat = 'YYYY-MM';
            break;
          case 'year':
            currentDateFormat = 'YYYY';
            break;
        }
        reuseComponents(
          components[level],
          dates,
          date => date && { level, date, currentDate, currentDateFormat },
          ChartCalendarDateComponent
        );
        level++;
      }
      update();
    })
  );
  onDestroy(() => {
    components.forEach(level => level.forEach(component => component.destroy()));
  });

  componentActions.push(element => {
    state.update('_internal.elements.chart-calendar', element);
  });

  const actions = Actions.create(componentActions, actionProps);
  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions} style=${styleMap}>
          ${components.map(
            (components, level) => html`
              <div class=${className + '-dates ' + className + `-dates--level-${level}`}>
                ${components.map(m => m.html())}
              </div>
            `
          )}
        </div>
      `,
      { props, vido, templateProps }
    );
}
