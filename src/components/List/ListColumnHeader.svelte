<script>
  export let column;

  import ListColumnHeaderResizer from './ListColumnHeaderResizer.svelte';
  import ListExpander from './ListExpander.svelte';
  import { getContext, onDestroy } from 'svelte';
  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'list-column-header';
  const action = api.getAction(componentName);
  let className, contentClass, width, style;
  onDestroy(
    state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
      const value = state.get('config');
      className = api.getClass(componentName, { column });
      contentClass = api.getClass(componentName + '-content', { column });
      style = `--height: ${value.headerHeight}px;`;
    })
  );
</script>

<div class={className} use:action={{ column, api, state }} {style}>
  {#if typeof column.expander === 'boolean' && column.expander}
    <ListExpander row={false} />
  {/if}
  <ListColumnHeaderResizer {column}>
    <div class={contentClass}>
      {#if typeof column.header.isHtml === 'boolean' && column.header.isHtml}
        {@html column.header.content}
      {:else}{column.header.content}{/if}
    </div>
  </ListColumnHeaderResizer>
</div>
