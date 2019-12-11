/**
 * ChartTimelineGridRow component
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
    let shouldUpdate = false;
    let rows = data.state.get('_internal.elements.chart-timeline-grid-rows');
    if (typeof rows === 'undefined') {
      rows = [];
      shouldUpdate = true;
    }
    if (!rows.includes(element)) {
      rows.push(element);
      shouldUpdate = true;
    }
    if (shouldUpdate) data.state.update('_internal.elements.chart-timeline-grid-rows', rows, { only: null });
  }
  destroy(element, data) {
    data.state.update('_internal.elements.chart-timeline-grid-rows', rows => {
      return rows.filter(el => el !== element);
    });
  }
}

export default function ChartTimelineGridRow(vido, props) {
  const { api, state, onDestroy, Detach, Actions, update, html, reuseComponents, onChange, StyleMap } = vido;
  const componentName = 'chart-timeline-grid-row';
  const actionProps = {
    ...props,
    api,
    state
  };
  let wrapper;
  onDestroy(
    state.subscribe('config.wrappers.ChartTimelineGridRow', value => {
      wrapper = value;
      update();
    })
  );

  const GridBlockComponent = state.get('config.components.ChartTimelineGridRowBlock');

  const componentActions = api.getActions(componentName);
  let className = api.getClass(componentName);

  let styleMap = new StyleMap(
    {
      width: props.width + 'px',
      height: props.row.height + 'px',
      overflow: 'hidden'
    },
    true
  );

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  let rowsBlocksComponents = [];
  onChange(function onPropsChange(changedProps, options) {
    if (options.leave || changedProps.row === undefined) {
      shouldDetach = true;
      reuseComponents(rowsBlocksComponents, [], block => block, GridBlockComponent);
      update();
      return;
    }
    shouldDetach = false;
    props = changedProps;
    reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
    styleMap.setStyle({});
    styleMap.style.height = props.row.height + 'px';
    styleMap.style.width = props.width + 'px';
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent?.style?.grid?.row?.children;
      if (childrenStyle)
        for (const name in childrenStyle) {
          styleMap.style[name] = childrenStyle[name];
        }
    }
    const currentStyle = props?.row?.style?.grid?.row?.current;
    if (currentStyle)
      for (const name in currentStyle) {
        styleMap.style[name] = currentStyle[name];
      }
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    update();
  });

  onDestroy(function destroy() {
    rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
  });

  if (componentActions.indexOf(BindElementAction) === -1) {
    componentActions.push(BindElementAction);
  }

  const actions = Actions.create(componentActions, actionProps);

  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
          ${rowsBlocksComponents.map(r => r.html())}
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
