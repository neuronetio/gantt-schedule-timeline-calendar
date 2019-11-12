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

const ChartTimelineItemsRowItem = (vido, props) => {
  const { api, state, onDestroy, actions, update, html, onChange, styleMap } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let style = { width: '', height: '', transform: '', opacity: '1', pointerEvents: 'all' },
    contentStyle = {},
    itemLeftPx = 0,
    itemWidthPx = 0,
    leave = false;

  const updateItem = () => {
    if (leave) return;
    contentStyle = {};
    let time = state.get('_internal.chart.time');
    itemLeftPx = (props.item.time.start - time.leftGlobal) / time.timePerPixel;
    itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing') || 0;
    style.width = itemWidthPx + 'px';
    style.height = props.row.height + 'px';
    style.transform = `translate(${itemLeftPx}px, 0px)`;
    style.opacity = '1';
    style.pointerEvents = 'all';
    if (typeof props.item.style === 'object' && props.item.style.constructor.name === 'Object') {
      if (typeof props.item.style.current === 'string') {
        contentStyle = { ...contentStyle, ...props.item.style.current };
      }
    }
    update();
  };

  const onPropsChange = (changedProps, options) => {
    if (options.leave) {
      leave = true;
      style.opacity = '0';
      style.pointerEvents = 'none';
      return update();
    } else {
      leave = false;
    }
    props = changedProps;
    updateItem();
  };
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

  return templateProps =>
    wrapper(
      html`
        <div
          class=${className}
          data-actions=${actions(componentActions, {
            item: props.item,
            row: props.row,
            left: itemLeftPx,
            width: itemWidthPx,
            api,
            state
          })}
          style=${styleMap(style)}
        >
          <div class=${contentClassName} style=${styleMap(contentStyle)}>
            <div class=${labelClassName}>${props.item.label}</div>
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
};
export default ChartTimelineItemsRowItem;
