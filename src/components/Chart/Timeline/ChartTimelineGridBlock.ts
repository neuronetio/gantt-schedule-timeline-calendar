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
  const componentName = 'chart-gantt-grid-block';
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

  let style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px`;
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
