/**
 * ChartTimelineGridRowBlock component
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
    '_internal.elements.chart-timeline-grid-row-blocks',
    blocks => {
      if (typeof blocks === 'undefined') {
        blocks = [];
      }
      blocks.push(element);
      return blocks;
    },
    { only: null }
  );
  return {
    update() {},
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-grid-row-blocks', blocks => {
        return blocks.filter(el => el !== element);
      });
    }
  };
}

export default function ChartTimelineGridRowBlock(vido, props) {
  const { api, state, onDestroy, actions, update, html, onChange } = vido;
  const componentName = 'chart-timeline-grid-row-block';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(
    state.subscribe('config.wrappers.ChartTimelineGridRowBlock', value => {
      wrapper = value;
      update();
    })
  );

  const currentTime = api.time
    .date()
    .startOf('day')
    .valueOf();
  let className, classNameContent;
  function updateClassName(time) {
    className = api.getClass(componentName);
    classNameContent = className + '-content';
    if (time.leftGlobal === currentTime) {
      className += ' current';
    }
  }
  updateClassName(props.time);
  let style = `width: ${props.time.width}px;height: 100%;margin-left:-${props.time.subPx}px;`;
  onChange(changedProps => {
    props = changedProps;
    updateClassName(props.time);
    style = `width: ${props.time.width}px; height: 100%; margin-left:-${props.time.subPx}px; `;
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      if (
        typeof parent.style === 'object' &&
        typeof parent.style.gridBlock === 'object' &&
        typeof parent.style.gridBlock.children === 'string'
      ) {
        style += parent.style.gridBlock.children;
      }
    }
    if (
      typeof props.row.style === 'object' &&
      typeof props.row.style.gridBlock === 'object' &&
      typeof props.row.style.gridBlock.current === 'string'
    ) {
      style += props.row.style.gridBlock.current;
    }
    update();
  });

  if (componentActions.indexOf(bindElementAction) === -1) {
    componentActions.push(bindElementAction);
  }

  return () =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { ...props, api, state })} style=${style}>
          <div class=${classNameContent} />
        </div>
      `,
      { props, vido, templateProps: props }
    );
}
