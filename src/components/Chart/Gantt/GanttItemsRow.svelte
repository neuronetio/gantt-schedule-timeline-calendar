<script>
  export let rowId;

  import { getContext, onDestroy, onMount } from 'svelte';
  import Item from './GanttItemsRowItem.svelte';

  const api = getContext('api');
  const state = getContext('state');

  let rowPath = `_internal.flatTreeMapById.${rowId}`,
    itemsPath = `_internal.flatTreeMapById.${rowId}._internal.items`;
  $: {
    rowPath = `_internal.flatTreeMapById.${rowId}`;
    itemsPath = `_internal.flatTreeMapById.${rowId}._internal.items`;
    rowUpdate();
    itemsUpdate();
  }

  let row, element, style, styleInner;
  function rowUpdate() {
    row = state.get(rowPath);
    const chart = state.get('_internal.chart');
    style = `width:${chart.dimensions.width}px;height:${row.height}px;--row-height:${row.height}px;`;
    styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
    if (element) {
      element.scrollLeft = chart.time.leftPx;
    }
  }

  let items;
  function itemsUpdate() {
    items = state.get(itemsPath);
  }

  onDestroy(state.subscribeAll([rowPath, '_internal.chart'], rowUpdate, { bulk: true }));

  onMount(rowUpdate);

  onDestroy(
    state.subscribe(itemsPath, value => {
      itemsUpdate();
    })
  );

  const componentName = 'chart-gantt-items-row';
  const componentNameInner = componentName + '-inner';
  const action = api.getAction(componentName, { row });
  let className = api.getClass(componentName, { row });
  let classNameInner = api.getClass(componentNameInner, { row });
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row });
      classNameInner = api.getClass(componentNameInner, { row });
    })
  );
</script>

<div class={className} use:action={{ row, api, state }} {style} bind:this={element}>
  <div class={classNameInner} style={styleInner}>
    {#each items as item}
      <Item rowId={row.id} itemId={item.id} />
    {/each}
  </div>
</div>
