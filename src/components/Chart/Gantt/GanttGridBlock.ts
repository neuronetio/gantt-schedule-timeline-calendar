export default function GanttGridBlock({ row, time, top }, vido) {
  const { api, state, onDestroy, actions, update, html } = vido;
  const componentName = 'chart-gantt-grid-block';
  const componentActions = api.getActions(componentName, { row, time, top });
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
    html`
      <div
        class=${className}
        data-actions=${actions(componentActions, { row, time, top, api, state })}
        style=${style}
      />
    `;
}
