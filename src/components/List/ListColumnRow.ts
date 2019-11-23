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
 * Save element
 * @param {HTMLElement} element
 * @param {object} data
 */
function saveElement(element, data) {
  data.state.update('_internal.elements.list-column-rows', elements => {
    if (typeof elements === 'undefined') {
      elements = [];
    }
    if (!elements.includes(element)) {
      elements.push(element);
    }
    return elements;
  });
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

  let ListExpanderComponent;
  onDestroy(state.subscribe('config.components.ListExpander', value => (ListExpanderComponent = value)));

  let rowPath = `_internal.flatTreeMapById.${props.rowId}`,
    row = state.get(rowPath);
  let colPath = `config.list.columns.data.${props.columnId}`,
    column = state.get(colPath);
  let styleMap = new StyleMap(
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
  const ListExpander = createComponent(ListExpanderComponent, { row });

  const onPropsChange = (changedProps, options) => {
    if (options.leave) {
      shouldDetach = true;
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
    if (rowSub) {
      rowSub();
    }
    if (colSub) {
      colSub();
    }
    rowPath = `_internal.flatTreeMapById.${rowId}`;
    colPath = `config.list.columns.data.${columnId}`;
    rowSub = state.subscribeAll(
      [rowPath, colPath, 'config.list.expander'],
      bulk => {
        column = state.get(colPath);
        row = state.get(rowPath);
        const expander = state.get('config.list.expander');
        // @ts-ignore
        styleMap.setStyle({}); // we must reset style because of user specified styling
        styleMap.style['height'] = row.height + 'px';
        styleMap.style['--height'] = row.height + 'px';
        if (column.expander) {
          styleMap.style['--expander-padding-width'] = expander.padding * (row._internal.parents.length + 1) + 'px';
        }
        for (let parentId of row._internal.parents) {
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
  let componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      update();
    })
  );

  function getHtml() {
    if (typeof column.data === 'function') return unsafeHTML(column.data(row));
    return unsafeHTML(row[column.data]);
  }

  function getText() {
    if (typeof column.data === 'function') return column.data(row);
    return row[column.data];
  }

  if (!componentActions.includes(saveElement)) componentActions.push(saveElement);

  actionProps.pointerOptions = {
    axis: 'x|y',
    onMove({ movementX, movementY }) {
      if (movementX) {
        state.update('config.list.columns.percent', percent => {
          percent += movementX;
          if (percent < 0) percent = 0;
          if (percent > 100) percent = 100;
          return percent;
        });
      } else if (movementY) {
        state.update('config.scroll.top', top => {
          top -= movementY;
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
          ${column.expander ? ListExpander.html() : null}
          <div class=${className + '-content'}>
            ${column.isHTML ? getHtml() : getText()}
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
}
