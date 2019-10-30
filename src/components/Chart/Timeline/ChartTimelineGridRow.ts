/**
 * ChartTimelineGridRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimelineGridRow(vido, props) {
  const { api, state, onDestroy, actions, update, html, reuseComponents, onChange } = vido;
  const componentName = 'chart-timeline-grid-row';
  let wrapper;
  onDestroy(
    state.subscribe('config.wrappers.ChartTimelineGridRow', value => {
      wrapper = value;
      update();
    })
  );

  const GridBlockComponent = state.get('config.components.ChartTimelineGridRowBlock');

  const componentActions = api.getActions(componentName);
  let className = api.getClass(componentName);

  let style;
  let rowsBlocksComponents = [];
  onChange(changedProps => {
    props = changedProps;
    reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
    style = `height: ${props.row.height}px;`;
    update();
  });

  onDestroy(() => {
    rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
  });

  return templateProps =>
    wrapper(
      html`
        <div
          class=${className}
          data-actions=${actions(componentActions, {
            row: props.row,
            blocks: props.blocks,
            top: props.top,
            api,
            state
          })}
          style=${style}
        >
          ${rowsBlocksComponents.map(r => r.html())}
        </div>
      `,
      { vido, props, templateProps }
    );
}
