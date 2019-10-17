/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function GanttGridBlock({ row, time, top }, vido) {
  const { api, state, onDestroy, actions, update, html } = vido;
  const componentName = 'chart-timeline-grid-block';
  const componentActions = api.getActions(componentName, { row, time, top });

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineGridBlock', value => (wrapper = value)));

  let className = api.getClass(componentName, { row });
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      if (
        time.leftGlobal ===
        api.time
          .date()
          .startOf('day')
          .valueOf()
      ) {
        className += ' current';
      }
      update();
    })
  );

  let style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px;`;
  for (const parentId of row.rowData._internal.parents) {
    const parent = state.get('config.list.rows.' + parentId);
    if (typeof parent.style === 'object' && parent.style.constructor.name === 'Object') {
      if (typeof parent.style.gridBlock === 'object' && parent.style.gridBlock.constructor.name === 'Object') {
        if (typeof parent.style.gridBlock.children === 'string') {
          style += parent.style.gridBlock.children;
        }
      }
    }
  }
  if (typeof row.rowData.style === 'object' && row.rowData.style.constructor.name === 'Object') {
    if (typeof row.rowData.style.gridBlock === 'object' && row.rowData.style.gridBlock.constructor.name === 'Object') {
      if (typeof row.rowData.style.gridBlock.current === 'string') {
        style += row.rowData.style.gridBlock.current;
      }
    }
  }
  return props =>
    wrapper(
      html`
        <div
          class=${className}
          data-actions=${actions(componentActions, { row, time, top, api, state })}
          style=${style}
        />
      `,
      { props: { row, time, top }, vido, templateProps: props }
    );
}
