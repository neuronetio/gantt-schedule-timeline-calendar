/**
 * ChartTimelineItemsRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ChartTimelineItemsRow(vido, { row }) {
  const { api, state, onDestroy, actions, update, html, onChange, componentsFromDataArray } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));

  const ItemComponent = state.get('config.components.ChartTimelineItemsRowItem');

  let itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;
  let rowSub, itemsSub;

  let element, scrollLeft, style, styleInner;
  let itemComponents = [];

  function updateDom() {
    const chart = state.get('_internal.chart');
    style = `width:${chart.dimensions.width}px;height:${row.height}px;--row-height:${row.height}px;`;
    styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
    if (element && scrollLeft !== chart.time.leftPx) {
      element.scrollLeft = chart.time.leftPx;
      scrollLeft = chart.time.leftPx;
    }
  }

  function updateRow(row) {
    itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;

    updateDom();
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
      itemComponents = componentsFromDataArray(itemComponents, value, item => ({ row, item }), ItemComponent);
      updateDom();
      update();
    });
  }

  onChange(props => {
    row = props.row;
    updateRow(row);
  });

  updateRow(row);

  onDestroy(() => {
    itemComponents.forEach(item => item.destroy());
  });

  const componentName = 'chart-timeline-items-row';
  const componentNameInner = componentName + '-inner';
  const componentActions = api.getActions(componentName);
  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row });
      classNameInner = api.getClass(componentNameInner, { row });
      update();
    })
  );

  return props =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions)} style=${style}>
          <div class=${classNameInner} style=${styleInner}>
            ${itemComponents.map(i => i.html())}
          </div>
        </div>
      `,
      { props: { row }, vido, templateProps: props }
    );
}
