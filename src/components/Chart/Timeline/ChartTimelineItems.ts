/**
 * ChartTimelineItems component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ChartTimelineItems(vido) {
  const { api, state, onDestroy, actions, update, html, componentsFromDataArray } = vido;
  const componentName = 'chart-timeline-items';
  const componentActions = api.getActions(componentName);
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItems', value => (wrapper = value)));

  const ItemsRowComponent = state.get('config.components.ChartTimelineItemsRow');

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  let rowsComponents = [];
  onDestroy(
    state.subscribeAll(
      ['_internal.list.visibleRows', 'config.chart.items', 'config.list.rows'],
      () => {
        const visibleRows = state.get('_internal.list.visibleRows');
        rowsComponents = componentsFromDataArray(rowsComponents, visibleRows, row => ({ row }), ItemsRowComponent);
        update();
      },
      { bulk: true }
    )
  );

  onDestroy(() => {
    rowsComponents.forEach(row => row.destroy());
  });

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { api, state })}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `,
      { props: {}, vido, templateProps: props }
    );
}
