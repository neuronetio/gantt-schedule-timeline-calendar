<script>
  export let row;
  export let time;
  export let top;

  import { getContext, onDestroy } from 'svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'chart-gantt-grid-block';
  const action = api.getAction(componentName, { row, time, top });
  let className = api.getClass(componentName, { row });
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  $: style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px`;
</script>

<div class={className} use:action={{ row, time, top, api, state }} {style} />
