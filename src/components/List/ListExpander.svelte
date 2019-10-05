<script>
  export let row;

  import { getContext, onDestroy } from 'svelte';
  import ListToggle from './ListToggle.svelte';

  const state = getContext('state');
  const api = getContext('api');

  const componentName = 'list-expander';
  const action = api.getAction(componentName);
  let className,
    padding,
    width,
    rows,
    paddingClass,
    children = [];

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { row });
      paddingClass = api.getClass(componentName + '-padding', { row });
    })
  );

  onDestroy(
    state.subscribeAll(['config.list.expander.padding'], value => {
      padding = value;
    })
  );
  if (row) {
    onDestroy(
      state.subscribe(`_internal.list.rows.${row.id}.parentId`, parentId => {
        width = 'width:' + row._internal.parents.length * padding + 'px';
        children = row._internal.children;
      })
    );
  } else {
    width = 'width:0px';
    children = [];
  }
</script>

<div class={className} use:action={{ row, api, state }}>
  <div class={paddingClass} style={width} />
  {#if children.length > 0 || !row}
    <ListToggle {row} />
  {/if}
</div>
