/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function GanttGrid(vido) {
  const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
  const componentName = 'chart-timeline-grid';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineGrid', value => (wrapper = value)));

  const GridRowComponent = state.get('config.components.ChartTimelineGridRow');

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  let height, style;
  onDestroy(
    state.subscribe('_internal.height', h => {
      height = h;
      style = `height: ${height}px`;
      update();
    })
  );

  let period;
  onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));

  let rows,
    rowsComponents = [];
  onDestroy(
    state.subscribeAll(
      [`_internal.chart.time.dates.${period}`, '_internal.list.visibleRows', 'config.chart.grid.block'],
      function generateBlocks() {
        const rowsData = state.get('_internal.list.visibleRows');
        const periodDates = state.get(`_internal.chart.time.dates.${period}`);
        if (!periodDates) {
          return;
        }
        rowsComponents.forEach(row => row.component.destroy());
        rowsComponents = [];
        let top = 0;
        rows = [];
        for (const rowId in rowsData) {
          const rowData = rowsData[rowId];
          const blocks = [];
          let index = 0;
          for (const date of periodDates) {
            blocks.push({ id: index++, date, row: rowData, top });
          }
          const row = { id: rowData.id, blocks, rowData, top };
          rows.push(row);
          rowsComponents.push({ id: rowData.id, component: createComponent(GridRowComponent, { row }) });
          top += rowData.height;
          update();
        }
      },
      { bulk: true }
    )
  );

  componentActions.push(element => {
    state.update('_internal.elements.grid');
  });

  onDestroy(() => {
    rowsComponents.forEach(row => row.component.destroy());
  });

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { api, state })} style=${style}>
          ${rowsComponents.map(r => r.component.html())}
        </div>
      `,
      { props: {}, vido, templateProps: props }
    );
}
