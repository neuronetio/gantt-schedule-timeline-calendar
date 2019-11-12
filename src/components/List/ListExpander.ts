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
  const { api, state, onDestroy, actions, update, html, createComponent, onChange } = vido;
  const componentName = 'list-expander';
  const componentActions = api.getActions(componentName);
  let className, padding, width, paddingClass;

  let ListToggleComponent;
  onDestroy(state.subscribe('config.components.ListToggle', value => (ListToggleComponent = value)));
  const ListToggle = createComponent(ListToggleComponent, props.row ? { row: props.row } : {});
  onDestroy(ListToggle.destroy);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListExpander', value => (wrapper = value)));

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      paddingClass = api.getClass(componentName + '-padding');
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
    let parentSub;
    const onPropsChange = changedProps => {
      props = changedProps;
      if (parentSub) parentSub();
      parentSub = state.subscribe(`_internal.list.rows.${props.row.id}.parentId`, function parentChanged(parentId) {
        width = 'width:' + props.row._internal.parents.length * padding + 'px';
        update();
      });
      ListToggle.change(props);
    };
    onChange(onPropsChange);
    onDestroy(function listExpanderDestroy() {
      if (parentSub) parentSub();
    });
  } else {
    width = 'width:0px';
  }

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-action=${actions(componentActions, { row: props.row, api, state })}>
          <div class=${paddingClass} style=${width}></div>
          ${ListToggle.html()}
        </div>
      `,
      { vido, props, templateProps }
    );
}
