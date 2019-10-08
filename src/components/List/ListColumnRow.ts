import ListExpander from './ListExpander';
export default function ListColumnRow({ rowId, columnId }, core) {
  const { api, state, onDestroy, action, update, html, createComponent } = core;

  let row,
    rowPath = `config.list.rows.${rowId}`;
  let style;
  onDestroy(
    state.subscribe(rowPath, value => {
      row = value;
      style = `--height: ${row.height}px`;
      update();
    })
  );

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(
    state.subscribe(columnPath, val => {
      column = val;
      update();
    })
  );

  const componentName = 'list-column-row';
  const componentAction = api.getAction(componentName);
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

  const listExpander = createComponent(ListExpander, { row });
  onDestroy(listExpander.destroy);

  return props => html`
    <div
      class=${className}
      style=${style}
      data-action=${action(componentAction, {
        column,
        row,
        api,
        state
      })}
    >
      ${typeof column.expander === 'boolean' && column.expander ? listExpander.html() : ''}
      ${typeof column.html === 'string' ? getHtml() : getText()}
    </div>
  `;
}
