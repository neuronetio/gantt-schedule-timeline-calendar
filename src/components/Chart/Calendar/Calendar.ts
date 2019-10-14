import DateComponent from './CalendarDate';

export default function Calendar(vido) {
  const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;
  const componentName = 'chart-calendar';
  const componentActions = api.getActions(componentName);

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

  let dates,
    datesComponents = [];
  onDestroy(
    state.subscribe('_internal.chart.time.dates', value => {
      dates = value;
      datesComponents.forEach(date => date.component.destroy());
      datesComponents = [];
      for (const date of dates) {
        datesComponents.push({ id: date.id, component: createComponent(DateComponent, { date }) });
      }
      update();
    })
  );
  onDestroy(() => {
    datesComponents.forEach(date => date.component.destroy());
  });

  componentActions.push(element => {
    state.update('_internal.elements.calendar', element);
  });

  return props => html`
    <div class=${className} data-actions=${actions(componentActions)} style=${style}>
      ${repeat(datesComponents, d => d.id, d => d.component.html())}
    </div>
  `;
}
