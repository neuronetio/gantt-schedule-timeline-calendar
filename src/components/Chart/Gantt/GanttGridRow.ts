import GridBlock from './GanttGridBlock';
export default function GanttGridRow({ row }, core) {
  const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
  const componentName = 'chart-gantt-grid-row';

  const componentAction = api.getAction(componentName, { row });
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row });
      update();
    })
  );

  let rowsBlocksComponents = [];
  for (const block of row.blocks) {
    rowsBlocksComponents.push({
      id: block.id,
      component: createComponent(GridBlock, { row, time: block.date, top: block.top })
    });
  }

  onDestroy(() => {
    rowsBlocksComponents.forEach(row => row.component.destroy());
  });

  let style = `height: ${row.rowData.height}px;`;

  return props => html`
    <div class=${className} data-action=${action(componentAction, { row, api, state })} style=${style}>
      ${rowsBlocksComponents.map(r => r.component.html())}
    </div>
  `;
}
