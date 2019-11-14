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
  const { api, state, onDestroy, actions, update, html, onChange, styleMap, text } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let style = { width: '', height: '', transform: '', opacity: '1', pointerEvents: 'all' },
    contentStyle = { width: '', height: '' },
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
    itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing') || 0;
    // @ts-ignore
    style = {};
    style.width = itemWidthPx + 'px';
    style.height = props.row.height + 'px';
    style.transform = `translate(${itemLeftPx}px, 0px)`;
    style.opacity = '1';
    style.pointerEvents = 'all';
    // @ts-ignore
    contentStyle = { 'max-width': itemWidthPx + 'px', 'max-height': props.row.height + 'px' };
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent.style?.items?.item?.children;
      if (childrenStyle) contentStyle = { ...contentStyle, ...childrenStyle };
    }
    const currentRowItemsStyle = props.row?.style?.items?.item?.current;
    if (currentRowItemsStyle) contentStyle = { ...contentStyle, ...currentRowItemsStyle };
    const currentStyle = props.item?.style;
    if (currentStyle) contentStyle = { ...contentStyle, ...currentStyle };
    update();
  }

  function onPropsChange(changedProps, options) {
    if (options.leave) {
      leave = true;
      style.opacity = '0';
      style.pointerEvents = 'none';
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
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap(style)}>
          <div class=${contentClassName} style=${styleMap(contentStyle)}>
            <div class=${labelClassName}>
              ${text(props.item.label)}
            </div>
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
export default ChartTimelineItemsRowItem;
