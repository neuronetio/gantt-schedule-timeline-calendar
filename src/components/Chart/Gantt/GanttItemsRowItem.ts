export default function GanttItemsRowItem({ rowId, itemId }, core) {
  const { api, state, onDestroy, action, render, html, createComponent, repeat } = core;

  let row,
    rowPath = `config.list.rows.${rowId}`;
  onDestroy(
    state.subscribe(rowPath, value => {
      row = value;
      render();
    })
  );
  let item,
    itemPath = `config.chart.items.${itemId}`;
  onDestroy(
    state.subscribe(itemPath, value => {
      item = value;
      render();
    })
  );

  const componentName = 'chart-gantt-items-row-item';
  const componentAction = api.getAction(componentName, { row, item });
  let className, contentClassName, labelClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row, item });
      contentClassName = api.getClass(componentName + '-content', { row, item });
      labelClassName = api.getClass(componentName + '-content-label', { row, item });
      render();
    })
  );

  let style,
    itemLeftPx = 0,
    itemWidthPx = 0;
  onDestroy(
    state.subscribe(
      '_internal.chart.time',
      bulk => {
        let time = state.get('_internal.chart.time');
        itemLeftPx = (item.time.start - time.from) / time.timePerPixel;
        itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
        style = `left:${itemLeftPx}px;width:${itemWidthPx}px;`;
        render();
      },
      { bulk: true }
    )
  );

  return props => html`
    <div
      class=${className}
      data-action=${action(componentAction, { item, row, left: itemLeftPx, width: itemWidthPx, api, state })}
      style=${style}
    >
      <div class=${contentClassName}>
        <div class=${labelClassName}">${item.label}</div>
      </div>
    </div>
  `;
}
