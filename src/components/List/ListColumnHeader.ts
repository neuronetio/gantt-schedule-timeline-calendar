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
  const { api, state, onDestroy, onChange, Actions, update, createComponent, html, cache, StyleMap } = vido;

  const actionProps = { ...props, api, state };

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
  let columnSub = state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
    column = val;
    update();
  });

  onDestroy(columnSub);

  onChange(changedProps => {
    props = changedProps;
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    if (columnSub) columnSub();
    columnSub = state.subscribe(`config.list.columns.data.${props.columnId}`, val => {
      column = val;
      update();
    });
  });

  let className, contentClass;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      contentClass = api.getClass(componentName + '-content');
    })
  );

  const styleMap = new StyleMap({
    height: '',
    '--height': '',
    '--paddings-count': ''
  });
  onDestroy(
    state.subscribe('config.headerHeight', () => {
      const value = state.get('config');
      styleMap.style['height'] = value.headerHeight + 'px';
      styleMap.style['--height'] = value.headerHeight + 'px';
      styleMap.style['--paddings-count'] = '1';
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

  const actions = Actions.create(componentActions, actionProps);

  return templateProps =>
    wrapper(
      html`
        <div class=${className} style=${styleMap} data-actions=${actions}>
          ${cache(column.expander ? withExpander() : withoutExpander())}
        </div>
      `,
      { vido, props, templateProps }
    );
}
