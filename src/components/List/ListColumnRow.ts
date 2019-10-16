/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ListColumnRow({ rowId, columnId }, vido) {
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));

  let ListExpanderComponent;
  onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));

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

  const ListExpander = createComponent(ListExpanderComponent, { row });
  onDestroy(ListExpander.destroy);

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(
    state.subscribe(columnPath, val => {
      column = val;
      update();
    })
  );

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
