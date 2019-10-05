<script>
  import ListColumn from './ListColumn.svelte';
  import { getContext, onDestroy, onMount } from 'svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'list';
  const action = api.getAction(componentName);
  let className;
  let expandedHeight,
    style = '';

  let list, percent;
  onDestroy(
    state.subscribe('config.list', () => {
      list = state.get('config.list');
      percent = list.columns.percent;
    })
  );

  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { list });
    })
  );

  let visibleRows = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows', rows => {
      visibleRows = rows;
    })
  );

  onDestroy(
    state.subscribe('_internal.list.expandedHeight', value => {
      expandedHeight = value;
    })
  );

  let columns;
  onDestroy(
    state.subscribe(
      'config.list.columns.data',
      data => {
        columns = Object.keys(state.get('config.list.columns.data'));
      },
      { bulk: true }
    )
  );

  onDestroy(
    state.subscribe('config.height', height => {
      style = `height: ${height}px`;
    })
  );

  let clientWidth = 0;
  $: {
    let width = clientWidth;
    if (percent === 0) {
      width = 0;
    }
    state.update('_internal.list.width', () => width);
  }

  function onScroll(event) {
    if (event.type === 'scroll') {
      state.update('config.scroll.top', event.target.scrollTop);
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      state.update('config.scroll.top', top => {
        return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
      });
    }
  }

  let element;
  onMount(() => {
    state.update('_internal.elements.List', element);
  });
</script>

{#if list.columns.percent > 0}
  <div
    class={className}
    use:action={{ list, api, state }}
    {style}
    on:scroll={onScroll}
    on:wheel|passive|capture={onScroll}
    bind:clientWidth
    bind:this={element}>
    {#each columns as columnId}
      <ListColumn {columnId} {visibleRows} />
    {/each}
  </div>
{/if}
