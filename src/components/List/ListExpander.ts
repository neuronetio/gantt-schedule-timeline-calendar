import ListToggle from './ListToggle';
export default function ListExpander(props, vido) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'list-expander';
  const componentActions = api.getActions(componentName);
  let className,
    padding,
    width,
    rows,
    paddingClass,
    children = [];

  onDestroy(
    state.subscribe('config.classNames', value => {
      if (props.row) {
        className = api.getClass(componentName, { row: props.row });
        paddingClass = api.getClass(componentName + '-padding', { row: props.row });
      } else {
        className = api.getClass(componentName);
        paddingClass = api.getClass(componentName + '-padding');
      }
      update();
    })
  );

  onDestroy(
    state.subscribeAll(['config.list.expander.padding'], value => {
      padding = value;
      update();
    })
  );
  if (props.row) {
    onDestroy(
      state.subscribe(`_internal.list.rows.${props.row.id}.parentId`, parentId => {
        width = 'width:' + props.row._internal.parents.length * padding + 'px';
        children = props.row._internal.children;
        update();
      })
    );
  } else {
    width = 'width:0px';
    children = [];
  }
  // @ts-ignore
  const listToggle = createComponent(ListToggle, props.row ? { row: props.row } : {});
  onDestroy(listToggle.destroy);

  return () => html`
    <div class=${className} data-action=${actions(componentActions, { row: props.row, api, state })}>
      <div class=${paddingClass} style=${width}></div>
      ${children.length || !props.row ? listToggle.html() : ''}
    </div>
  `;
}
