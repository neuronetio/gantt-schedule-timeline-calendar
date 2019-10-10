import GridComponent from './GanttGrid';
import ItemsComponent from './GanttItems';
export default function Gantt(vido) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'chart-gantt';
  const componentActions = api.getActions(componentName);

  const Grid = createComponent(GridComponent);
  onDestroy(Grid.destroy);
  const Items = createComponent(ItemsComponent);
  onDestroy(Items.destroy);

  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameInner = api.getClass(componentName + '-inner');
      update();
    })
  );

  let style = '',
    styleInner = '';
  onDestroy(
    state.subscribeAll(['_internal.height', '_internal.list.expandedHeight'], () => {
      style = `height: ${state.get('_internal.height')}px`;
      styleInner = `height: ${state.get('_internal.list.expandedHeight')}px;`;
      update();
    })
  );

  componentActions.push({
    create(element) {
      state.update('_internal.elements.Gantt', element);
    }
  });

  return props => html`
    <div class=${className} style=${style} data-actions=${actions(componentActions)} @wheel=${api.onScroll}>
      <div class=${classNameInner} style=${styleInner}>
        ${Grid.html()}${Items.html()}
      </div>
    </div>
  `;
}
