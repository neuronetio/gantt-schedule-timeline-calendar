import GridComponent from './GanttGrid';
import ItemsComponent from './GanttItems';
export default function Gantt(core) {
  const { api, state, onDestroy, action, render, html, createComponent } = core;
  const componentName = 'chart-gantt';
  const componentAction = api.getAction(componentName);

  const Grid = createComponent(GridComponent);
  onDestroy(Grid.destroy);
  const Items = createComponent(ItemsComponent);
  onDestroy(Items.destroy);

  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameInner = api.getClass(componentName + '-inner');
      render();
    })
  );

  let style = '',
    styleInner = '';
  onDestroy(
    state.subscribeAll(['_internal.height', '_internal.list.expandedHeight'], () => {
      style = `height: ${state.get('_internal.height')}px`;
      styleInner = `height: ${state.get('_internal.list.expandedHeight')}px;`;
      render();
    })
  );

  function mainAction(element) {
    state.update('_internal.elements.Gantt', element);
    if (typeof componentAction === 'function') {
      componentAction({ api, state });
    }
  }

  return props => html`
    <div class=${className} style=${style} data-action=${action(mainAction)} @wheel=${api.onScroll}>
      <div class=${classNameInner} style=${styleInner}>
        ${Grid.html()}${Items.html()}
      </div>
    </div>
  `;
}
