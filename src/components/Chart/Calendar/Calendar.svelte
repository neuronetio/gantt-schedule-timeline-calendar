<script>
  import { getContext, onDestroy, onMount } from 'svelte';
  import Date from './CalendarDate.svelte';

  const api = getContext('api');
  const state = getContext('state');
  const componentName = 'chart-calendar';
  const action = api.getAction(componentName);

  let className;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
    })
  );

  let headerHeight,
    style = '';
  onDestroy(
    state.subscribe('config.headerHeight', value => {
      headerHeight = value;
      style = `height: ${headerHeight}px;`;
    })
  );

  let dates;
  onDestroy(state.subscribe('_internal.chart.time.dates', value => (dates = value)));

  let element;
  onMount(() => {
    state.update('_internal.elements.Calendar', element);
  });
</script>

<div class={className} use:action={{ api, state }} {style} bind:this={element}>
  {#if dates.length === 0}
    <div style="text-align:center;padding-top: {headerHeight / 3}px">No data</div>
  {:else}
    {#each dates as date}
      <Date {date} />
    {/each}
  {/if}
</div>
