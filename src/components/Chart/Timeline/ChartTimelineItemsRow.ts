/**
 * ChartTimelineItemsRow component
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
    '_internal.elements.chart-timeline-items-rows',
    rows => {
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
      data.state.update('_internal.elements.chart-timeline-items-rows', rows => {
        return rows.filter(el => el !== element);
      });
    }
  };
}

export default function ChartTimelineItemsRow(vido, props) {
  const { api, state, onDestroy, actions, update, html, onChange, reuseComponents } = vido;
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));

  const ItemComponent = state.get('config.components.ChartTimelineItemsRowItem');

  let itemsPath = `_internal.flatTreeMapById.${props.row.id}._internal.items`;
  let rowSub, itemsSub;

  let element, scrollLeft, style, styleInner;
  let itemComponents = [];

  function updateDom() {
    const chart = state.get('_internal.chart');
    style = `width:${chart.dimensions.width}px;height:${props.row.height}px;--row-height:${props.row.height}px;`;
    styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
    if (element && scrollLeft !== chart.time.leftPx) {
      element.scrollLeft = chart.time.leftPx;
      scrollLeft = chart.time.leftPx;
    }
  }

  function updateRow(row) {
    itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;

    if (typeof rowSub === 'function') {
      rowSub();
    }
    if (typeof itemsSub === 'function') {
      itemsSub();
    }

    rowSub = state.subscribe('_internal.chart', (bulk, eventInfo) => {
      updateDom();
      update();
    });

    itemsSub = state.subscribe(itemsPath, value => {
      itemComponents = reuseComponents(itemComponents, value, item => ({ row, item }), ItemComponent);
      updateDom();
      update();
    });
  }

  onChange(changedProps => {
    props = changedProps;
    updateRow(props.row);
  });

  onDestroy(() => {
    itemsSub();
    rowSub();
    itemComponents.forEach(item => item.destroy());
  });

  const componentName = 'chart-timeline-items-row';
  const componentNameInner = componentName + '-inner';
  const componentActions = api.getActions(componentName);
  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
      classNameInner = api.getClass(componentNameInner, props);
      update();
    })
  );

  if (componentActions.indexOf(bindElementAction) === -1) {
    componentActions.push(bindElementAction);
  }

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, { ...props, api, state })} style=${style}>
          <div class=${classNameInner} style=${styleInner}>
            ${itemComponents.map(i => i.html())}
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
