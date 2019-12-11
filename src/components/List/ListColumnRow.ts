/**
 * ListColumnRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

/**
 * Bind element action
 */
class BindElementAction {
  constructor(element, data) {
    let elements = data.state.get('_internal.elements.list-column-rows');
    let shouldUpdate = false;
    if (typeof elements === 'undefined') {
      shouldUpdate = true;
      elements = [];
    }
    if (!elements.includes(element)) {
      elements.push(element);
      shouldUpdate = true;
    }
    if (shouldUpdate) data.state.update('_internal.elements.list-column-rows', elements);
  }
  public destroy(element, data) {
    data.state.update('_internal.elements.list-column-rows', elements => {
      return elements.filter(el => el !== element);
    });
  }
}

export default function ListColumnRow(vido, props) {
  const {
    api,
    state,
    onDestroy,
    Detach,
    Actions,
    update,
    html,
    createComponent,
    onChange,
    StyleMap,
    unsafeHTML,
    PointerAction
  } = vido;

  const actionProps = { ...props, api, state };
  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRow', value => (wrapper = value)));

  let ListColumnRowExpanderComponent;
  onDestroy(
    state.subscribe('config.components.ListColumnRowExpander', value => (ListColumnRowExpanderComponent = value))
  );

  let rowPath = `_internal.flatTreeMapById.${props.rowId}`,
    row = state.get(rowPath);
  let colPath = `config.list.columns.data.${props.columnId}`,
    column = state.get(colPath);
  const styleMap = new StyleMap(
    column.expander
      ? {
          height: '',
          top: '',
          '--height': '',
          '--expander-padding-width': '',
          '--expander-size': ''
        }
      : {
          height: '',
          top: '',
          '--height': ''
        },
    true
  );
  let rowSub, colSub;
  const ListColumnRowExpander = createComponent(ListColumnRowExpanderComponent, { row });

  const onPropsChange = (changedProps, options) => {
    if (options.leave || changedProps.rowId === undefined || changedProps.columnId === undefined) {
      shouldDetach = true;
      if (rowSub) rowSub();
      if (colSub) colSub();
      update();
      return;
    }
    shouldDetach = false;
    props = changedProps;
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    const rowId = props.rowId;
    const columnId = props.columnId;
    if (rowSub) rowSub();
    if (colSub) colSub();
    rowPath = `_internal.flatTreeMapById.${rowId}`;
    colPath = `config.list.columns.data.${columnId}`;
    rowSub = state.subscribeAll(
      [rowPath, colPath, 'config.list.expander'],
      bulk => {
        column = state.get(colPath);
        row = state.get(rowPath);
        if (column === undefined || row === undefined) {
          shouldDetach = true;
          update();
          return;
        }
        if (column === undefined || row === undefined) return;
        const expander = state.get('config.list.expander');
        // @ts-ignore
        styleMap.setStyle({}); // we must reset style because of user specified styling
        styleMap.style['height'] = row.height + 'px';
        styleMap.style['--height'] = row.height + 'px';
        if (column.expander) {
          styleMap.style['--expander-padding-width'] = expander.padding * (row._internal.parents.length + 1) + 'px';
        }
        for (const parentId of row._internal.parents) {
          const parent = state.get(`_internal.flatTreeMapById.${parentId}`);
          if (typeof parent.style === 'object' && parent.style.constructor.name === 'Object') {
            if (typeof parent.style.children === 'object') {
              const childrenStyle = parent.style.children;
              for (const name in childrenStyle) {
                styleMap.style[name] = childrenStyle[name];
              }
            }
          }
        }
        if (
          typeof row.style === 'object' &&
          row.style.constructor.name === 'Object' &&
          typeof row.style.current === 'object'
        ) {
          const rowCurrentStyle = row.style.current;
          for (const name in rowCurrentStyle) {
            styleMap.style[name] = rowCurrentStyle[name];
          }
        }
        update();
      },
      { bulk: true }
    );

    if (ListColumnRowExpander) {
      ListColumnRowExpander.change({ row });
    }

    colSub = state.subscribe(colPath, val => {
      column = val;
      update();
    });
  };
  onChange(onPropsChange);

  onDestroy(() => {
    if (ListColumnRowExpander) ListColumnRowExpander.destroy();
    colSub();
    rowSub();
  });
  const componentName = 'list-column-row';
  let componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      update();
    })
  );

  function getHtml() {
    if (row === undefined) return null;
    if (typeof column.data === 'function') return unsafeHTML(column.data(row));
    return unsafeHTML(row[column.data]);
  }

  function getText() {
    if (row === undefined) return null;
    if (typeof column.data === 'function') return column.data(row);
    return row[column.data];
  }

  if (!componentActions.includes(BindElementAction)) componentActions.push(BindElementAction);

  actionProps.pointerOptions = {
    axis: 'x|y',
    onMove({ event, movementX, movementY }) {
      event.stopPropagation();
      event.preventDefault();
      if (movementX) {
        state.update('config.list.columns.percent', percent => {
          percent += movementX * state.get('config.scroll.xMultiplier');
          if (percent < 0) percent = 0;
          if (percent > 100) percent = 100;
          return percent;
        });
      } else if (movementY) {
        state.update('config.scroll.top', top => {
          top -= movementY * state.get('config.scroll.yMultiplier');
          top = api.limitScroll('top', top);
          return top;
        });
      }
    }
  };

  componentActions.push(PointerAction);

  const actions = Actions.create(componentActions, actionProps);

  return templateProps =>
    wrapper(
      html`
        <div detach=${detach} class=${className} style=${styleMap} data-actions=${actions}>
          ${column.expander ? ListColumnRowExpander.html() : null}
          <div class=${className + '-content'}>
            ${column.isHTML ? getHtml() : getText()}
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
}
