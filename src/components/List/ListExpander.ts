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
  let className;

  let ListToggleComponent;
  onDestroy(state.subscribe('config.components.ListToggle', value => (ListToggleComponent = value)));
  const ListToggle = createComponent(ListToggleComponent, props.row ? { row: props.row } : {});
  onDestroy(ListToggle.destroy);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListExpander', value => (wrapper = value)));

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      update();
    })
  );

  if (props.row) {
    let parentSub;
    function onPropsChange(changedProps) {
      props = changedProps;
      ListToggle.change(props);
    }
    onChange(onPropsChange);
    onDestroy(function listExpanderDestroy() {
      if (parentSub) parentSub();
    });
  }

  const actionProps = { row: props.row, api, state };
  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-action=${actions(componentActions, actionProps)}>
          ${ListToggle.html()}
        </div>
      `,
      { vido, props, templateProps }
    );
}
