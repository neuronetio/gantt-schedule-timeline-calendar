<script>
  import { getContext, onDestroy } from 'svelte';
  import Row from './GanttItemsRow.svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'chart-gantt-items';
  const action = api.getAction(componentName);
  let className = api.getClass(componentName);
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  let rows = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows', visibleRows => {
      rows = visibleRows;
    })
  );
</script>

<div class={className} use:action={{ api, state }}>
  {#each rows as row}
    <Row rowId={row.id} />
  {/each}
</div>
