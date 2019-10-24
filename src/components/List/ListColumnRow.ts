/**
 * ListColumnRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ListColumnRow(vido, { rowId, columnId }) {
  const { api, state, onDestroy, actions, update, html, createComponent, onChange } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));

  let ListExpanderComponent;
  onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));

  let row,
    rowPath = `_internal.flatTreeMapById.${rowId}`;
  let column,
    colPath = `config.list.columns.data.${columnId}`;
  let style;
  let rowSub, colSub;
  let ListExpander;
  onChange(({ rowId, columnId }) => {
    if (rowSub) {
      rowSub();
    }
    if (colSub) {
      colSub();
    }
    rowPath = `_internal.flatTreeMapById.${rowId}`;
    colPath = `config.list.columns.data.${columnId}`;
    rowSub = state.subscribe(rowPath, value => {
      row = value;
      style = `--height: ${row.height}px;`;
      for (let parentId of row._internal.parents) {
        const parent = state.get(`_internal.flatTreeMapById.${parentId}`);
        if (typeof parent.style === 'object' && parent.style.constructor.name === 'Object') {
          if (typeof parent.style.children === 'string') {
            style += parent.style.children;
          }
        }
      }
      if (
        typeof row.style === 'object' &&
        row.style.constructor.name === 'Object' &&
        typeof row.style.current === 'string'
      ) {
        style += row.style.current;
      }
      update();
    });

    if (ListExpander) {
      ListExpander.destroy();
    }
    ListExpander = createComponent(ListExpanderComponent, { row });

    colSub = state.subscribe(colPath, val => {
      column = val;
      update();
    });
  });

  onDestroy(() => {
    if (ListExpander) ListExpander.destroy();
  });
  const componentName = 'list-column-row';
  const componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row, column });
      update();
    })
  );

  function getHtml() {
    if (typeof column.data === 'function')
      return html`
        ${column.data(row)}
      `;
    return html`
      ${row[column.data]}
    `;
  }

  function getText() {
    if (typeof column.data === 'function') return column.data(row);
    return row[column.data];
  }

  return props =>
    wrapper(
      html`
        <div
          class=${className}
          style=${style}
          data-actions=${actions(componentActions, {
            column,
            row,
            api,
            state
          })}
        >
          ${typeof column.expander === 'boolean' && column.expander ? ListExpander.html() : ''}
          ${typeof column.html === 'string' ? getHtml() : getText()}
        </div>
      `,
      { vido, props: { rowId, columnId }, templateProps: props }
    );
}
