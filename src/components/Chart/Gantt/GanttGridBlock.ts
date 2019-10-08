export default function GanttGridBlock({ row, time, top }, core) {
  const { api, state, onDestroy, action, render, html } = core;
  const componentName = 'chart-gantt-grid-block';
  const componentAction = api.getAction(componentName, { row, time, top });
  let className = api.getClass(componentName, { row });
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      render();
    })
  );

  let style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px`;
  return props =>
    html`
      <div class=${className} data-action=${action(componentAction, { row, time, top, api, state })} style=${style} />
    `;
}
