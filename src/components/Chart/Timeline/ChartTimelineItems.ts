/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function GnattItems(vido) {
  const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
  const componentName = 'chart-gantt-items';
  const componentActions = api.getActions(componentName);

  const ItemsRowComponent = state.get('config.components.ChartTimelineItemsRow');

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  let rows = [],
    rowsComponents = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows;', visibleRows => {
      rows = visibleRows;
      rowsComponents.forEach(row => row.component.destroy());
      rowsComponents = [];
      for (const row of rows) {
        rowsComponents.push({ id: row.id, component: createComponent(ItemsRowComponent, { rowId: row.id }) });
      }
      update();
    })
  );

  onDestroy(() => {
    rowsComponents.forEach(row => row.component.destroy());
  });

  return props => html`
    <div class=${className} data-actions=${actions(componentActions, { api, state })}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
}
