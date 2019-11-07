/**
 * ChartTimelineItemsRowItem component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

function bindElementAction(element, data) {
  data.state.update(
    '_internal.elements.chart-timeline-items-row-items',
    items => {
      if (typeof items === 'undefined') {
        items = [];
      }
      items.push(element);
      return items;
    },
    { only: null }
  );
  return {
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-items-row-items', items => {
        return items.filter(el => el !== element);
      });
    }
  };
}

export default function ChartTimelineItemsRowItem(vido, props) {
  const { api, state, onDestroy, actions, update, html, onChange } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));
  let style,
    contentStyle,
    itemLeftPx = 0,
    itemWidthPx = 0;

  function updateItem() {
    contentStyle = '';
    let time = state.get('_internal.chart.time');
    itemLeftPx = (props.item.time.start - time.leftGlobal) / time.timePerPixel;
    itemWidthPx = (props.item.time.end - props.item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing');
    style = `left:${itemLeftPx}px; width:${itemWidthPx}px; `;
    if (typeof props.item.style === 'object' && props.item.style.constructor.name === 'Object') {
      if (typeof props.item.style.current === 'string') {
        contentStyle += props.item.style.current;
      }
    }
    update();
  }

  onChange(changedProps => {
    props = changedProps;
    updateItem();
  });

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
          style=${style}
        >
          <div class=${contentClassName} style=${contentStyle}>
            <div class=${labelClassName}>${props.item.label}</div>
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
}
