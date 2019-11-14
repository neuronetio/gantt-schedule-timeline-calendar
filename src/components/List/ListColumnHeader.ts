/**
 * ListColumnHeader component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListColumnHeader(vido, props) {
  const { api, state, onDestroy, actions, update, createComponent, html, cache } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnHeader', value => (wrapper = value)));

  const componentName = 'list-column-header';
  const componentActions = api.getActions(componentName);

  let ListColumnHeaderResizerComponent;
  onDestroy(
    state.subscribe('config.components.ListColumnHeaderResizer', value => (ListColumnHeaderResizerComponent = value))
  );
  const ListColumnHeaderResizer = createComponent(ListColumnHeaderResizerComponent, { columnId: props.columnId });
  onDestroy(ListColumnHeaderResizer.destroy);

  let ListExpanderComponent;
  onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));
  const ListExpander = createComponent(ListExpanderComponent, {});
  onDestroy(ListExpander.destroy);

  let column;
  onDestroy(
    state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
      column = val;
      update();
    })
  );

  let className, contentClass, style;
  onDestroy(
    state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
      const value = state.get('config');
      className = api.getClass(componentName, { column });
      contentClass = api.getClass(componentName + '-content', { column });
      style = `--height: ${value.headerHeight}px;height:${value.headerHeight}px;`;
      update();
    })
  );

  function withExpander() {
    return html`
      <div class=${contentClass}>
        ${ListExpander.html()}${ListColumnHeaderResizer.html(column)}
      </div>
    `;
  }

  function withoutExpander() {
    return html`
      <div class=${contentClass}>
        ${ListColumnHeaderResizer.html(column)}
      </div>
    `;
  }

  const actionProps = { column, api, state };
  return templateProps =>
    wrapper(
      html`
        <div class=${className} style=${style} data-actions=${actions(componentActions, actionProps)}>
          ${cache(typeof column.expander === 'boolean' && column.expander ? withExpander() : withoutExpander())}
        </div>
      `,
      { vido, props, templateProps }
    );
}
