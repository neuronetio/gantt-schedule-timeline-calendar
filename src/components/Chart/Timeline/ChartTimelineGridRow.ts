/**
 * ChartTimelineGridRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 * @returns {object} with update and destroy
 */
function bindElementAction(element, data) {
  data.state.update(
    '_internal.elements.chart-timeline-grid-rows',
    function updateGridRows(rows) {
      if (typeof rows === 'undefined') {
        rows = [];
      }
      rows.push(element);
      return rows;
    },
    { only: null }
  );
  return {
    update() {},
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-grid-rows', rows => {
        return rows.filter(el => el !== element);
      });
    }
  };
}

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
  function onPropsChange(changedProps) {
    props = changedProps;
    reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
    let compensation = 0;
    if (props.blocks.length) {
      compensation = props.blocks[0].time.subPx;
    }
    style = `height: ${props.row.height}px; transform: translate(-${compensation}px, 0px)`;
    update();
  }
  onChange(onPropsChange);

  onDestroy(() => {
    rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
  });

  if (componentActions.indexOf(bindElementAction) === -1) {
    componentActions.push(bindElementAction);
  }

  return function updateTemplate(templateProps) {
    return wrapper(
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
  };
}
