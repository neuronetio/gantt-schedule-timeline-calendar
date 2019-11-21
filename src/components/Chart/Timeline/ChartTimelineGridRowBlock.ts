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

const bindElementAction = (element, data) => {
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

  return element => {
    data.state.update(
      '_internal.elements.chart-timeline-grid-row-blocks',
      blocks => {
        return blocks.filter(el => el !== element);
      },
      { only: [''] }
    );
  };
};

interface Props {
  row: any;
  time: any;
}

const ChartTimelineGridRowBlock = (vido, props: Props) => {
  const { api, state, onDestroy, Detach, Actions, update, html, onChange, StyleMap } = vido;
  const componentName = 'chart-timeline-grid-row-block';
  const actionProps = {
    ...props,
    api,
    state
  };

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

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
  let styleMap = new StyleMap({ width: '', height: '' });
  /**
   * On props change
   * @param {any} changedProps
   */
  function onPropsChange(changedProps, options) {
    if (options.leave) {
      shouldDetach = true;
      return update();
    }
    shouldDetach = false;
    props = changedProps;
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    updateClassName(props.time);
    styleMap.setStyle({});
    styleMap.style.width = props.time.width + 'px';
    styleMap.style.height = props.row.height + 'px';
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent.style?.grid?.block?.children;
      if (childrenStyle) styleMap.setStyle({ ...styleMap.style, ...childrenStyle });
    }
    const currentStyle = props.row?.style?.grid?.block?.current;
    if (currentStyle) styleMap.setStyle({ ...styleMap.style, ...currentStyle });
    update();
  }
  onChange(onPropsChange);
  if (!componentActions.includes(bindElementAction)) {
    componentActions.push(bindElementAction);
  }
  const actions = Actions.create(componentActions, actionProps);
  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}></div>
      `,
      { props, vido, templateProps }
    );
  };
};
export default ChartTimelineGridRowBlock;
