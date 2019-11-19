/**
 * ChartTimelineItems component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimelineItems(vido, props = {}) {
  const { api, state, onDestroy, actions, update, html, reuseComponents, StyleMap } = vido;
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
  let styleMap = new StyleMap({});
  const calculateStyle = () => {
    const width = state.get('_internal.chart.dimensions.width');
    const height = state.get('_internal.height');
    styleMap.style.width = width + 'px';
    styleMap.style.height = height + 'px';
  };
  onDestroy(state.subscribeAll(['_internal.height', '_internal.chart.dimensions.width'], calculateStyle));
  let rowsComponents = [];
  const createRowComponents = () => {
    const visibleRows = state.get('_internal.list.visibleRows');
    rowsComponents = reuseComponents(rowsComponents, visibleRows, row => ({ row }), ItemsRowComponent);
    update();
  };
  onDestroy(
    state.subscribeAll(['_internal.list.visibleRows', 'config.chart.items', 'config.list.rows'], createRowComponents, {
      bulk: true
    })
  );

  onDestroy(function destroyRows() {
    rowsComponents.forEach(row => row.destroy());
  });

  const actionProps = { api, state };
  return templateProps =>
    wrapper(
      html`
        <div class=${className} style=${styleMap} data-actions=${actions(componentActions, actionProps)}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `,
      { props, vido, templateProps }
    );
}
