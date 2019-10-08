import ListColumnComponent from './ListColumn';
export default function List(core) {
  const { api, state, onDestroy, action, render, createComponent, html, repeat } = core;

  const componentName = 'list';
  const componentAction = api.getAction(componentName);
  let className;

  let list, percent;
  onDestroy(
    state.subscribe('config.list', () => {
      list = state.get('config.list');
      percent = list.columns.percent;
      render();
    })
  );

  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { list });
      render();
    })
  );

  let columns,
    listColumns = [];
  onDestroy(
    state.subscribe('config.list.columns.data', data => {
      // only 'config.list.columns.data;' because listcolumn component will watch nested values
      listColumns.forEach(ls => ls.component.destroy());
      listColumns = [];
      columns = Object.keys(data);
      columns.forEach(columnId => {
        const component = createComponent(ListColumnComponent, {
          columnId
        });
        listColumns.push({ id: columnId, component });
      });
      render();
    })
  );

  onDestroy(() => {
    listColumns.forEach(c => c.component.destroy());
  });

  let style;
  onDestroy(
    state.subscribe('config.height', height => {
      style = `height: ${height}px`;
      render();
    })
  );

  function onScroll(event) {
    if (event.type === 'scroll') {
      state.update('config.scroll.top', event.target.scrollTop);
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      state.update('config.scroll.top', top => {
        return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
      });
    }
  }

  let width;
  function mainAction(element) {
    if (!width) {
      width = element.clientWidth;
      if (percent === 0) {
        width = 0;
      }
      state.update('_internal.list.width', width);
      state.update('_internal.elements.List', element);
    }
    if (typeof action === 'function') {
      componentAction(element, { list, columns, state, api });
    }
  }

  return props =>
    list.columns.percent > 0
      ? html`
          <div
            class=${className}
            data-action=${action(mainAction)}
            style=${style}
            @scroll=${onScroll}
            @wheel=${onScroll}
          >
            ${repeat(listColumns, listColumn => listColumn.id, c => c.component.html())}
          </div>
        `
      : null;
}
