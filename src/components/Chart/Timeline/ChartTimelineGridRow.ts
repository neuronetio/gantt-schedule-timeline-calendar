/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function GanttGridRow({ row }, vido) {
  const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
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

  let rowsBlocksComponents = [];
  for (const block of row.blocks) {
    rowsBlocksComponents.push({
      id: block.id,
      component: createComponent(GridBlockComponent, { row, time: block.date, top: block.top })
    });
  }

  onDestroy(() => {
    rowsBlocksComponents.forEach(row => row.component.destroy());
  });

  let style = `height: ${row.rowData.height}px;`;

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
