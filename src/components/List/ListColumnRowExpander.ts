/**
 * ListColumnRowExpander component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListColumnRowExpander(vido, props) {
  const { api, state, onDestroy, Actions, update, html, createComponent, onChange } = vido;
  const componentName = 'list-column-row-expander';
  const componentActions = api.getActions(componentName);
  const actionProps = { ...props, api, state };
  let className;

  let ListColumnRowExpanderToggleComponent;
  onDestroy(
    state.subscribe(
      'config.components.ListColumnRowExpanderToggle',
      value => (ListColumnRowExpanderToggleComponent = value)
    )
  );
  const ListColumnRowExpanderToggle = createComponent(
    ListColumnRowExpanderToggleComponent,
    props.row ? { row: props.row } : {}
  );
  onDestroy(ListColumnRowExpanderToggle.destroy);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRowExpander', value => (wrapper = value)));

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
      for (const prop in props) {
        actionProps[prop] = props[prop];
      }
      ListColumnRowExpanderToggle.change(props);
    }
    onChange(onPropsChange);
    onDestroy(function listExpanderDestroy() {
      if (parentSub) parentSub();
    });
  }

  const actions = Actions.create(componentActions, actionProps);

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-action=${actions}>
          ${ListColumnRowExpanderToggle.html()}
        </div>
      `,
      { vido, props, templateProps }
    );
}
