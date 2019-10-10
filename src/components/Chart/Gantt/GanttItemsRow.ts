import RowItemComponent from './GanttItemsRowItem';
export default function GanttItemsRow({ rowId }, vido) {
  const { api, state, onDestroy, actions, update, html, createComponent, repeat } = vido;
  let rowPath = `_internal.flatTreeMapById.${rowId}`;
  let row, element, style, styleInner;
  onDestroy(
    state.subscribeAll([rowPath, '_internal.chart'], bulk => {
      row = state.get(rowPath);
      const chart = state.get('_internal.chart');
      style = `width:${chart.dimensions.width}px;height:${row.height}px;--row-height:${row.height}px;`;
      styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
      if (element) {
        element.scrollLeft = chart.time.leftPx;
      }
      update();
    })
  );

  let items,
    itemComponents = [];
  onDestroy(
    state.subscribe(`_internal.flatTreeMapById.${rowId}._internal.items;`, value => {
      items = value;
      itemComponents.forEach(item => item.component.destroy());
      itemComponents = [];
      for (const item of items) {
        itemComponents.push({ id: item.id, component: createComponent(RowItemComponent, { rowId, itemId: item.id }) });
      }
      update();
    })
  );

  onDestroy(() => {
    itemComponents.forEach(item => item.component.destroy());
  });

  const componentName = 'chart-gantt-items-row';
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

  return props => html`
    <div class=${className} data-actions=${actions(componentActions)} style=${style}>
      <div class=${classNameInner} style=${styleInner}>
        ${repeat(itemComponents, i => i.id, i => i.component.html())}
      </div>
    </div>
  `;
}
