/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function GanttItemsRowItem({ rowId, itemId }, vido) {
  const { api, state, onDestroy, actions, update, html } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRowItem', value => (wrapper = value)));

  let row,
    rowPath = `config.list.rows.${rowId}`;
  onDestroy(
    state.subscribe(rowPath, value => {
      row = value;
      update();
    })
  );
  let item,
    itemPath = `config.chart.items.${itemId}`;
  onDestroy(
    state.subscribe(itemPath, value => {
      item = value;
      update();
    })
  );

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

  let style,
    itemLeftPx = 0,
    itemWidthPx = 0;
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time', 'config.scroll', itemPath],
      bulk => {
        item = state.get(itemPath);
        let time = state.get('_internal.chart.time');
        itemLeftPx = (item.time.start - time.leftGlobal) / time.timePerPixel;
        itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
        itemWidthPx -= state.get('config.chart.spacing');
        const inViewPort = api.isItemInViewport(item, time.leftGlobal, time.rightGlobal);
        style = `left:${itemLeftPx}px;width:${itemWidthPx}px;`;
        update();
      },
      { bulk: true }
    )
  );

  return props =>
    wrapper(
      html`
    <div
      class=${className}
      data-actions=${actions(componentActions, { item, row, left: itemLeftPx, width: itemWidthPx, api, state })}
      style=${style}
    >
      <div class=${contentClassName}>
        <div class=${labelClassName}">${item.label}</div>
      </div>
    </div>
  `,
      { vido, props: { rowId, itemId }, templateProps: props }
    );
}
