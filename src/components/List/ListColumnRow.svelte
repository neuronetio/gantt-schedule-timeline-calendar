<script>
  export let rowId;
  export let columnId;

  import { getContext, onDestroy } from 'svelte';
  import ListExpander from './ListExpander.svelte';

  const api = getContext('api');
  const state = getContext('state');

  let row,
    rowPath = `config.list.rows.${rowId}`;
  onDestroy(state.subscribe(rowPath, value => (row = value)));

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(state.subscribe(columnPath, val => (column = val)));

  const componentName = 'list-column-row';
  const action = api.getAction(componentName);
  let className = api.getClass(componentName, { row, column });
  $: if (row.index % 2 !== 0) {
    className = api.getClass(componentName, { row, column });
    className += ` ${api.name}__${componentName}--dark`;
  }

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row, column });
    })
  );
  $: style = `--height: ${row.height}px`;
</script>

<div class={className} use:action={{ row, column, api, state }} {style}>
  {#if typeof column.expander === 'boolean' && column.expander}
    <ListExpander {row} />
  {/if}
  {#if typeof column.isHtml === 'boolean' && column.isHtml}
    {#if typeof column.data === 'function'}
      {@html column.data(row)}
    {:else}
      {@html row[column.data]}
    {/if}
  {:else if typeof column.data === 'function'}{column.data(row)}{:else}{row[column.data]}{/if}
</div>
