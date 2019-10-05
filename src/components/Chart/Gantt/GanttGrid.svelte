<script>
  import { getContext, onDestroy, onMount, afterUpdate } from 'svelte';
  import GridRow from './GanttGridRow.svelte';
  import GridBlock from './GanttGridBlock.svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'chart-gantt-grid';
  const action = api.getAction(componentName);
  let className = api.getClass(componentName);
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  let height;
  onDestroy(
    state.subscribe('_internal.height', h => {
      height = h;
    })
  );
  $: style = `height: ${height}px`;

  let rows;
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time.dates', '_internal.list.visibleRows', 'config.chart.grid.block'],
      function generateBlocks() {
        const rowsData = state.get('_internal.list.visibleRows');
        const dates = state.get('_internal.chart.time.dates');
        const config = state.get('config');
        let top = 0;
        rows = [];
        for (const rowId in rowsData) {
          const rowData = rowsData[rowId];
          const blocks = [];
          let index = 0;
          for (const date of dates) {
            blocks.push({ id: index++, date, row: rowData, top });
          }
          rows.push({ id: rowData.id, blocks, rowData, top });
          top += rowData.height;
        }
      },
      { bulk: true }
    )
  );
</script>

<div class={className} use:action={{ api, state }} {style}>
  {#each rows as row}
    <GridRow {row} />
  {/each}
</div>
