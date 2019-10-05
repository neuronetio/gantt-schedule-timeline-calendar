<script>
  import { getContext, onDestroy, onMount } from 'svelte';
  import Grid from './GanttGrid.svelte';
  import Items from './GanttItems.svelte';

  const api = getContext('api');
  const state = getContext('state');
  const componentName = 'chart-gantt';
  const action = api.getAction(componentName);

  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameInner = api.getClass(componentName + '-inner');
    })
  );

  let style = '',
    styleInner = '';
  onDestroy(
    state.subscribeAll(['_internal.height', '_internal.list.expandedHeight'], () => {
      style = `height: ${state.get('_internal.height')}px`;
      styleInner = `height: ${state.get('_internal.list.expandedHeight')}px;`;
    })
  );

  let element;
  onMount(() => {
    state.update('_internal.elements.Gantt', element);
  });
</script>

<div class={className} {style} use:action={{ api, state }} on:wheel|passive|capture={api.onScroll} bind:this={element}>
  <div class={classNameInner} style={styleInner}>
    <Grid />
    <Items />
  </div>
</div>
