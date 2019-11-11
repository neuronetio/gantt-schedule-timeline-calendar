/**
 * ListColumnRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListColumnRow(vido, props) {
  const { api, state, onDestroy, actions, update, html, createComponent, onChange, styleMap } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));

  let ListExpanderComponent;
  onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));

  let rowPath = `_internal.flatTreeMapById.${props.rowId}`,
    row = state.get(rowPath);
  let colPath = `config.list.columns.data.${props.columnId}`,
    column = state.get(colPath);
  let style = { width: '', height: '', visibility: '', '--height': '' };
  let rowSub, colSub;
  const ListExpander = createComponent(ListExpanderComponent, { row });

  const onPropsChange = (changedProps, options) => {
    if (options.leave) {
      style.visibility = 'hidden';
      update();
      return;
    }
    props = changedProps;
    const rowId = props.rowId;
    const columnId = props.columnId;
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
      style['--height'] = row.height + 'px';
      style.width = props.width + 'px';
      style.height = row.height + 'px';
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
      ListExpander.change({ row });
    }

    colSub = state.subscribe(colPath, val => {
      column = val;
      update();
    });
  };
  onChange(onPropsChange);

  onDestroy(() => {
    if (ListExpander) ListExpander.destroy();
    colSub();
    rowSub();
  });
  const componentName = 'list-column-row';
  const componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
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

  return function updateTemplate(templateProps) {
    return wrapper(
      html`
        <div
          class=${className}
          style=${styleMap(style)}
          data-actions=${actions(componentActions, { column, row, api, state })}
        >
          ${typeof column.expander === 'boolean' && column.expander ? ListExpander.html() : ''}
          ${typeof column.html === 'string' ? getHtml() : getText()}
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
