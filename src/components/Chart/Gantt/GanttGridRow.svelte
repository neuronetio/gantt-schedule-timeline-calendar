<script>
  export let row;

  import { getContext, onDestroy } from 'svelte';
  import GridBlock from './GanttGridBlock.svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'chart-gantt-grid-row';
  const action = api.getAction(componentName, { row });
  let className = api.getClass(componentName, { row });
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row });
    })
  );

  $: style = `height: ${row.rowData.height}px;`;
</script>

<div class={className} use:action={{ row, api, state }} {style}>
  {#each row.blocks as block}
    <GridBlock row={block.row} time={block.date} top={block.top} />
  {/each}
</div>
