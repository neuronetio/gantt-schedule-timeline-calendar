import RowItemComponent from './GanttItemsRowItem';
export default function GanttItemsRow({ rowId }, core) {
  const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
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
  const componentAction = api.getAction(componentName, { row });
  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row });
      classNameInner = api.getClass(componentNameInner, { row });
      update();
    })
  );

  function mainAction(el) {
    element = el;
    if (typeof componentAction === 'function') {
      componentAction({ row, api, state });
    }
  }

  return props => html`
    <div class=${className} data-action=${action(mainAction)} style=${style}>
      <div class=${classNameInner} style=${styleInner}>
        ${repeat(itemComponents, i => i.id, i => i.component.html())}
      </div>
    </div>
  `;
}
