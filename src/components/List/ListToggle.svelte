<script>
  export let row;

  import { getContext, onDestroy } from 'svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'list-expander-toggle';
  let className, action, style;
  let classNameOpen, classNameClosed;
  let expanded = false;
  let iconOpen, iconClosed;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row });
      action = api.getAction(componentName);
      classNameOpen = api.getClass(componentName + '-open', { row });
      classNameClosed = api.getClass(componentName + '-closed', { row });
    })
  );
  onDestroy(
    state.subscribeAll(['config.list.expander.size', 'config.list.expander.icons'], () => {
      const value = state.get('config');
      style = `--size: ${value.list.expander.size}px`;
      iconOpen = value.list.expander.icons.open;
      iconClosed = value.list.expander.icons.closed;
    })
  );

  if (row) {
    onDestroy(
      state.subscribe(`config.list.rows.${row.id}.expanded`, isExpanded => {
        expanded = isExpanded;
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
        },
        { bulk: true }
      )
    );
  }

  function toggle() {
    expanded = !expanded;
    if (row) {
      state.update(`config.list.rows.${row.id}.expanded`, expanded);
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
</script>

<div class={className} use:action={{ row, api, state }} {style} on:click={toggle}>
  {#if expanded}
    <div class={classNameOpen}>
      {@html iconOpen}
    </div>
  {:else}
    <div class={classNameClosed}>
      {@html iconClosed}
    </div>
  {/if}
</div>
