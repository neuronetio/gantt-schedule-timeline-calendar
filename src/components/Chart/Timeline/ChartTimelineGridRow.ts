/**
 * ChartTimelineGridRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ChartTimelineGridRow(vido, { row }) {
  const { api, state, onDestroy, actions, update, html, createComponent, onChange, repeat } = vido;
  const componentName = 'chart-timeline-grid-row';

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineGridRow', value => (wrapper = value)));

  const GridBlockComponent = state.get('config.components.ChartTimelineGridBlock');

  const componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row });
      update();
    })
  );

  let style;
  let rowsBlocksComponents = [];
  onChange(({ row }) => {
    if (row.blocks.length !== rowsBlocksComponents.length) {
      rowsBlocksComponents.forEach(row => row.component.destroy());
      rowsBlocksComponents = [];
      for (const block of row.blocks) {
        rowsBlocksComponents.push({
          id: block.id,
          component: createComponent(GridBlockComponent, { row, time: block.date, top: block.top })
        });
      }
    } else {
      let index = 0;
      for (const block of row.blocks) {
        rowsBlocksComponents[index].id = block.id;
        rowsBlocksComponents[index].component.change({ row, time: block.date, top: block.top });
        index++;
      }
    }
    style = `height: ${row.rowData.height}px;`;
    update();
  });

  onDestroy(() => {
    rowsBlocksComponents.forEach(row => row.component.destroy());
  });

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { row, api, state })} style=${style}>
          ${rowsBlocksComponents.map(r => r.component.html())}
        </div>
      `,
      { vido, props: { row }, templateProps: props }
    );
}
