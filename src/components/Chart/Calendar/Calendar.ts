import DateComponent from './CalendarDate';

export default function Calendar(core) {
  const { api, state, onDestroy, action, render, createComponent, html, repeat } = core;
  const componentName = 'chart-calendar';
  const componentAction = api.getAction(componentName);

  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      render();
    })
  );

  let headerHeight,
    style = '';
  onDestroy(
    state.subscribe('config.headerHeight', value => {
      headerHeight = value;
      style = `height: ${headerHeight}px;`;
      render();
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
      render();
    })
  );
  onDestroy(() => {
    datesComponents.forEach(date => date.component.destroy());
  });

  function mainAction(element) {
    state.update('_internal.elements.Calendar', element);
    if (typeof componentAction === 'function') {
      componentAction({ api, state });
    }
  }

  return props => html`
    <div class=${className} data-action=${action(mainAction)} style=${style}>
      ${repeat(datesComponents, d => d.id, d => d.component.html())}
    </div>
  `;
}
