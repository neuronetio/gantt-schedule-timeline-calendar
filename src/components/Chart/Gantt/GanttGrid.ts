import GridRowComponent from './GanttGridRow';
//import GridBlock from './GanttGridBlock.svelte';
export default function GanttGrid(core) {
  const { api, state, onDestroy, action, render, html, createComponent, repeat } = core;
  const componentName = 'chart-gantt-grid';
  const componentAction = api.getAction(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      render();
    })
  );

  let height, style;
  onDestroy(
    state.subscribe('_internal.height', h => {
      height = h;
      style = `height: ${height}px`;
      render();
    })
  );

  let rows,
    rowsComponents = [];
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time.dates', '_internal.list.visibleRows', 'config.chart.grid.block'],
      function generateBlocks() {
        const rowsData = state.get('_internal.list.visibleRows');
        const dates = state.get('_internal.chart.time.dates');
        rowsComponents.forEach(row => row.component.destroy());
        rowsComponents = [];
        let top = 0;
        rows = [];
        for (const rowId in rowsData) {
          const rowData = rowsData[rowId];
          const blocks = [];
          let index = 0;
          for (const date of dates) {
            blocks.push({ id: index++, date, row: rowData, top });
          }
          const row = { id: rowData.id, blocks, rowData, top };
          rows.push(row);
          rowsComponents.push({ id: rowData.id, component: createComponent(GridRowComponent, { row }) });
          top += rowData.height;
          render();
        }
      },
      { bulk: true }
    )
  );

  onDestroy(() => {
    rowsComponents.forEach(row => row.component.destroy());
  });

  return props => html`
    <div class=${className} data-action=${action(componentAction, { api, state })} style=${style}>
      ${repeat(rowsComponents, r => r.id, r => r.component.html())}
    </div>
  `;
}
