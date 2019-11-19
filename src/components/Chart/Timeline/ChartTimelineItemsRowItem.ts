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
 * @param {Element} element
 * @param {any} data
 * @returns {object} with update and destroy
 */
const bindElementAction = (element, data) => {
  data.state.update(
    '_internal.elements.chart-timeline-items-row-items',
    function updateRowItems(items) {
      if (typeof items === 'undefined') {
        items = [];
      }
      items.push(element);
      return items;
    },
    { only: null }
  );
  return {
    update() {},
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
        return items.filter(el => el !== element);
      });
    }
  };
};

function ChartTimelineItemsRowItem(vido, props) {
  const { api, state, onDestroy, actions, update, html, onChange, unsafeHTML, StyleMap } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let styleMap = new StyleMap({ width: '', height: '', left: '', opacity: '1', pointerEvents: 'auto' }),
    contentStyleMap = new StyleMap({ width: '', height: '' }),
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
    const oldHeight = styleMap.style.height;
    //const oldTransform = styleMap.style.transform;
    const oldLeft = styleMap.style.left;
    styleMap.style = {};
    const inViewPort = api.isItemInViewport(props.item, time.leftGlobal, time.rightGlobal);
    styleMap.style.opacity = inViewPort ? '1' : '0';
    styleMap.style.pointerEvents = inViewPort ? 'auto' : 'none';
    if (inViewPort) {
      // update style only when visible to prevent browser's recalculate style
      styleMap.style.width = itemWidthPx + 'px';
      styleMap.style.height = props.row.height + 'px';
      //styleMap.style.transform = `translate(${itemLeftPx}px, 0px)`;
      styleMap.style.left = itemLeftPx + 'px';
    } else {
      styleMap.style.width = oldWidth;
      styleMap.style.height = oldHeight;
      styleMap.style.left = oldLeft;
      //styleMap.style.transform = oldTransform;
    }
    // @ts-ignore
    contentStyleMap.style = { width: itemWidthPx + 'px', 'max-height': props.row.height + 'px' };
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent.style?.items?.item?.children;
      if (childrenStyle) contentStyleMap.style = { ...contentStyleMap.style, ...childrenStyle };
    }
    const currentRowItemsStyle = props.row?.style?.items?.item?.current;
    if (currentRowItemsStyle) contentStyleMap.style = { ...contentStyleMap, ...currentRowItemsStyle };
    const currentStyle = props.item?.style;
    if (currentStyle) contentStyleMap.style = { ...contentStyleMap.style, ...currentStyle };
    update();
  }

  function onPropsChange(changedProps, options) {
    if (options.leave) {
      leave = true;
      styleMap.style.opacity = '0';
      styleMap.style.pointerEvents = 'none';
      return update();
    } else {
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
  let className, contentClassName, labelClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
      contentClassName = api.getClass(componentName + '-content', props);
      labelClassName = api.getClass(componentName + '-content-label', props);
      update();
    })
  );

  onDestroy(
    state.subscribe('_internal.chart.time', bulk => {
      updateItem();
    })
  );

  if (componentActions.indexOf(bindElementAction) === -1) {
    componentActions.push(bindElementAction);
  }

  return templateProps => {
    return wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          <div class=${contentClassName} style=${contentStyleMap}>
            <div class=${labelClassName}>
              ${props.item.isHtml ? unsafeHTML(props.item.label) : props.item.label}
            </div>
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
export default ChartTimelineItemsRowItem;
