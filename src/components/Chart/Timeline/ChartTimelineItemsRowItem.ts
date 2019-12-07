/**
 * ChartTimelineItemsRowItem component
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
    let items = data.state.get('_internal.elements.chart-timeline-items-row-items');
    if (typeof items === 'undefined') {
      items = [];
      shouldUpdate = true;
    }
    if (!items.includes(element)) {
      items.push(element);
      shouldUpdate = true;
    }
    if (shouldUpdate) data.state.update('_internal.elements.chart-timeline-items-row-items', items, { only: null });
  }
  destroy(element, data) {
    data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
      return items.filter(el => el !== element);
    });
  }
}

function ChartTimelineItemsRowItem(vido, props) {
  const { api, state, onDestroy, Detach, Actions, update, html, onChange, unsafeHTML, StyleMap } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let styleMap = new StyleMap({ width: '', height: '', left: '' }),
    itemLeftPx = 0,
    itemWidthPx = 0,
    leave = false;
  const actionProps = {
    item: props.item,
    row: props.row,
    left: itemLeftPx,
    width: itemWidthPx,
    api,
    state
  };
  let shouldDetach = false;

  function updateItem() {
    if (leave) return;
    let time = state.get('_internal.chart.time');
    itemLeftPx = (props.item.time.start - time.leftGlobal) / time.timePerPixel;
    itemLeftPx = Math.round(itemLeftPx * 10) * 0.1;
    itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing') || 0;
    if (itemWidthPx) {
      itemWidthPx = Math.round(itemWidthPx * 10) * 0.1;
    }
    const oldWidth = styleMap.style.width;
    const oldLeft = styleMap.style.left;
    const xCompensation = api.getCompensationX();
    styleMap.setStyle({});
    const inViewPort = api.isItemInViewport(props.item, time.leftGlobal, time.rightGlobal);
    shouldDetach = !inViewPort;
    if (inViewPort) {
      // update style only when visible to prevent browser's recalculate style
      styleMap.style.width = itemWidthPx + 'px';
      styleMap.style.left = itemLeftPx + xCompensation + 'px';
    } else {
      styleMap.style.width = oldWidth;
      styleMap.style.left = oldLeft;
    }
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent?.style?.items?.item?.children;
      if (childrenStyle) styleMap.setStyle({ ...styleMap.style, ...childrenStyle });
    }
    const currentRowItemsStyle = props?.row?.style?.items?.item?.current;
    if (currentRowItemsStyle) styleMap.setStyle({ ...styleMap.style, ...currentRowItemsStyle });
    const currentStyle = props?.item?.style;
    if (currentStyle) styleMap.setStyle({ ...styleMap.style, ...currentStyle });
    update();
  }

  function onPropsChange(changedProps, options) {
    if (options.leave || changedProps.row === undefined || changedProps.item === undefined) {
      leave = true;
      shouldDetach = true;
      return update();
    } else {
      shouldDetach = false;
      leave = false;
    }
    props = changedProps;
    actionProps.item = props.item;
    actionProps.row = props.row;
    actionProps.left = itemLeftPx;
    actionProps.width = itemWidthPx;
    updateItem();
  }
  onChange(onPropsChange);

  const componentName = 'chart-timeline-items-row-item';
  const componentActions = api.getActions(componentName);
  let className, labelClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
      labelClassName = api.getClass(componentName + '-label', props);
      update();
    })
  );

  onDestroy(
    state.subscribe('_internal.chart.time', bulk => {
      updateItem();
    })
  );

  componentActions.push(BindElementAction);
  const actions = Actions.create(componentActions, actionProps);
  const detach = new Detach(() => shouldDetach);

  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
          <div class=${labelClassName}>
            ${props.item.isHtml ? unsafeHTML(props.item.label) : props.item.label}
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
export default ChartTimelineItemsRowItem;
