import ListColumnHeaderResizerComponent from './ListColumnHeaderResizer';
import ListExpander from './ListExpander';

export default function ListColumnHeader({ columnId }, core) {
  const { api, state, onDestroy, action, render, createComponent, html } = core;

  const componentName = 'list-column-header';
  const componentAction = api.getAction(componentName);

  let column;
  onDestroy(
    state.subscribe(`config.list.columns.data.${columnId}`, val => {
      column = val;
      render();
    })
  );

  let className, contentClass, width, style;
  onDestroy(
    state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
      const value = state.get('config');
      className = api.getClass(componentName, { column });
      contentClass = api.getClass(componentName + '-content', { column });
      style = `--height: ${value.headerHeight}px;`;
      render();
    })
  );

  const ListColumnHeaderResizer = createComponent(ListColumnHeaderResizerComponent, { columnId });
  onDestroy(ListColumnHeaderResizer.destroy);

  // @ts-ignore
  const listExpander = createComponent(ListExpander, {});
  onDestroy(listExpander.destroy);

  function withExpander() {
    return html`
      <div class=${contentClass}>
        ${listExpander.html()}${ListColumnHeaderResizer.html(column)}
      </div>
    `;
  }

  function withoutExpander() {
    return html`
      <div class=${contentClass}>
        ${ListColumnHeaderResizer.html(column)}
      </div>
    `;
  }

  return function() {
    return html`
      <div class=${className} style=${style} data-action=${action(componentAction, { column, api, state })}>
        ${typeof column.expander === 'boolean' && column.expander ? withExpander() : withoutExpander()}
      </div>
    `;
  };
}
