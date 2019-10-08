export default function ListToggle(props, { api, state, onDestroy, action, render, html, unsafeHTML }) {
  const componentName = 'list-expander-toggle';
  let className, componentAction, style;
  let classNameOpen, classNameClosed;
  let expanded = false;
  let iconOpen, iconClosed;
  onDestroy(
    state.subscribe('config.classNames', value => {
      if (props.row) {
        className = api.getClass(componentName, { row: props.row });
        classNameOpen = api.getClass(componentName + '-open', { row: props.row });
        classNameClosed = api.getClass(componentName + '-closed', { row: props.row });
      } else {
        className = api.getClass(componentName);
        classNameOpen = api.getClass(componentName + '-open');
        classNameClosed = api.getClass(componentName + '-closed');
      }
      componentAction = api.getAction(componentName);
      render();
    })
  );
  onDestroy(
    state.subscribeAll(['config.list.expander.size', 'config.list.expander.icons'], () => {
      const expander = state.get('config.list.expander');
      style = `--size: ${expander.size}px`;
      iconOpen = expander.icons.open;
      iconClosed = expander.icons.closed;
      render();
    })
  );

  if (props.row) {
    onDestroy(
      state.subscribe(`config.list.rows.${props.row.id}.expanded`, isExpanded => {
        expanded = isExpanded;
        render();
      })
    );
  } else {
    onDestroy(
      state.subscribe(
        'config.list.rows.*.expanded',
        bulk => {
          for (const rowExpanded of bulk) {
            if (rowExpanded.value) {
              expanded = true;
              break;
            }
          }
          render();
        },
        { bulk: true }
      )
    );
  }

  function toggle() {
    expanded = !expanded;
    if (props.row) {
      state.update(`config.list.rows.${props.row.id}.expanded`, expanded);
    } else {
      state.update(
        `config.list.rows`,
        rows => {
          for (const rowId in rows) {
            rows[rowId].expanded = expanded;
          }
          return rows;
        },
        { only: ['*.expanded'] }
      );
    }
  }

  return () => html`
    <div
      class=${className}
      data-action=${action(componentAction, { row: props.row, api, state })}
      style=${style}
      @click=${toggle}
    >
      ${expanded
        ? html`
            <div class=${classNameOpen}>
              ${unsafeHTML(iconOpen)}
            </div>
          `
        : html`
            <div class=${classNameClosed}>
              ${unsafeHTML(iconClosed)}
            </div>
          `}
    </div>
  `;
}
