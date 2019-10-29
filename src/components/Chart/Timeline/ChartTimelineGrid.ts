/**
 * ChartTimelineGrid component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimelineGrid(vido) {
  const { api, state, onDestroy, actions, update, html, reuseComponents } = vido;
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

  let rowsComponents = [];
  onDestroy(
    state.subscribeAll(
      ['_internal.list.visibleRows;', `_internal.chart.time.dates.${period};`],
      function generateBlocks() {
        //console.profile('generate blocks');
        const visibleRows = state.get('_internal.list.visibleRows');
        const periodDates = state.get(`_internal.chart.time.dates.${period}`);
        if (!periodDates || periodDates.length === 0) {
          return;
        }
        let top = 0;
        const rowsAndBlocks = [];
        for (const row of visibleRows) {
          const blocks = [];
          for (const time of periodDates) {
            blocks.push({ time, row, top });
          }
          rowsAndBlocks.push({ row, blocks, top });
          top += row.height;
        }
        reuseComponents(rowsComponents, rowsAndBlocks, row => row, GridRowComponent);
        //console.profileEnd();
        update();
      },
      { bulk: true }
    )
  );

  componentActions.push(element => {
    state.update('_internal.elements.grid');
  });

  onDestroy(() => {
    rowsComponents.forEach(row => row.destroy());
  });

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { api, state })} style=${style}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `,
      { props: {}, vido, templateProps: props }
    );
}
