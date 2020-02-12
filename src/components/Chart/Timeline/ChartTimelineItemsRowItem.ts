/**
 * ChartTimelineItemsRowItem component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
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
  public destroy(element, data) {
    data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
      return items.filter(el => el !== element);
    });
  }
}

export default function ChartTimelineItemsRowItem(vido, props) {
  const { api, state, onDestroy, Detach, Actions, update, html, onChange, unsafeHTML, StyleMap } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let itemLeftPx = 0,
    itemWidthPx = 0,
    leave = false,
    cutLeft = false,
    cutRight = false;
  const styleMap = new StyleMap({ width: '', height: '', left: '' }),
    leftCutStyleMap = new StyleMap({ 'margin-left': '0px' }),
    rightCutStyleMap = new StyleMap({ 'margin-right': '0px' }),
    actionProps = {
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
    const time = state.get('_internal.chart.time');
    itemLeftPx = api.time.globalTimeToViewPixelOffset(props.item.time.start);
    itemLeftPx = Math.round(itemLeftPx * 10) * 0.1;
    itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing') || 0;
    if (itemWidthPx) {
      itemWidthPx = Math.round(itemWidthPx * 10) * 0.1;
    }
    if (props.item.time.start < time.leftGlobal) {
      leftCutStyleMap.style['margin-left'] = (time.leftGlobal - props.item.time.start) / time.timePerPixel + 'px';
      cutLeft = true;
    } else {
      leftCutStyleMap.style['margin-left'] = '0px';
      cutLeft = false;
    }
    if (props.item.time.end > time.rightGlobal) {
      rightCutStyleMap.style['margin-right'] = (props.item.time.end - time.rightGlobal) / time.timePerPixel + 'px';
      cutRight = true;
    } else {
      cutRight = false;
      rightCutStyleMap.style['margin-right'] = '0px';
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
    actionProps.left = itemLeftPx + xCompensation;
    actionProps.width = itemWidthPx;
    update();
  }

  const componentName = 'chart-timeline-items-row-item';
  const cutterName = api.getClass(componentName) + '-cut';
  const cutterLeft = html`
    <div class=${cutterName} style=${leftCutStyleMap}>
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 18 16" width="16">
        <path fill-opacity="0.5" fill="#ffffff" d="m5,3l-5,5l5,5l0,-10z" />
      </svg>
    </div>
  `;
  const cutterRight = html`
    <div class=${cutterName} style=${rightCutStyleMap}>
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 4 16" width="16">
        <path transform="rotate(-180 2.5,8) " fill-opacity="0.5" fill="#ffffff" d="m5,3l-5,5l5,5l0,-10z" />
      </svg>
    </div>
  `;
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
    updateItem();
  }
  onChange(onPropsChange);

  const componentActions = api.getActions(componentName);
  let className, labelClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
      labelClassName = api.getClass(componentName + '-label', props);
      update();
    })
  );

  onDestroy(state.subscribeAll(['_internal.chart.time', 'config.scroll.compensation.x'], updateItem));

  componentActions.push(BindElementAction);
  const actions = Actions.create(componentActions, actionProps);
  const detach = new Detach(() => shouldDetach);

  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
          ${cutLeft ? cutterLeft : ''}
          <div class=${labelClassName}>
            ${props.item.isHtml ? unsafeHTML(props.item.label) : props.item.label}
          </div>
          ${cutRight ? cutterRight : ''}
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
