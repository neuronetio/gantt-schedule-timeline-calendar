/**
 * ChartTimelineItemsRowItem component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimelineItemsRowItem(vido, { row, item }) {
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
    itemLeftPx = (item.time.start - time.leftGlobal) / time.timePerPixel;
    itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
    itemWidthPx -= state.get('config.chart.spacing');
    style = `left:${itemLeftPx}px; width:${itemWidthPx}px; `;
    if (typeof item.style === 'object' && item.style.constructor.name === 'Object') {
      if (typeof item.style.current === 'string') {
        contentStyle += item.style.current;
      }
    }
    update();
  }

  onChange(props => {
    row = props.row;
    item = props.item;
    updateItem();
  });

  const componentName = 'chart-timeline-items-row-item';
  const componentActions = api.getActions(componentName);
  let className, contentClassName, labelClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row, item });
      contentClassName = api.getClass(componentName + '-content', { row, item });
      labelClassName = api.getClass(componentName + '-content-label', { row, item });
      update();
    })
  );

  onDestroy(
    state.subscribe('_internal.chart.time', bulk => {
      updateItem();
    })
  );

  return props =>
    wrapper(
      html`
        <div
          class=${className}
          data-actions=${actions(componentActions, { item, row, left: itemLeftPx, width: itemWidthPx, api, state })}
          style=${style}
        >
          <div class=${contentClassName} style=${contentStyle}>
            <div class=${labelClassName}>${item.label}</div>
          </div>
        </div>
      `,
      { vido, props: { row, item }, templateProps: props }
    );
}
