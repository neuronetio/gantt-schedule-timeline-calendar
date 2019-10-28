/**
 * ListExpander component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListExpander(vido, props) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'list-expander';
  const componentActions = api.getActions(componentName);
  let className,
    padding,
    width,
    paddingClass,
    children = [];

  let ListToggleComponent;
  onDestroy(state.subscribe('config.components.ListToggle', value => (ListToggleComponent = value)));
  const ListToggle = createComponent(ListToggleComponent, props.row ? { row: props.row } : {});
  onDestroy(ListToggle.destroy);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListExpander', value => (wrapper = value)));

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

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-action=${actions(componentActions, { row: props.row, api, state })}>
          <div class=${paddingClass} style=${width}></div>
          ${children.length || !props.row ? ListToggle.html() : ''}
        </div>
      `,
      { vido, props, templateProps }
    );
}
