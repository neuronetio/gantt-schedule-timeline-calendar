<script>
  export let column;

  import { getContext, onDestroy } from 'svelte';

  const api = getContext('api');
  const state = getContext('state');

  const componentName = 'list-column-header-resizer';
  const action = api.getAction(componentName);
  let className, containerClass, dotsClass, dotClass, lineClass, calculatedWidth, width, dotsWidth;
  let inRealTime = false;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      containerClass = api.getClass(componentName + '-container', { column });
      dotsClass = api.getClass(componentName + '-dots', { column });
      dotClass = api.getClass(componentName + '-dots-dot', { column });
      lineClass = api.getClass(componentName + '-line', { column });
    })
  );
  onDestroy(
    state.subscribeAll(
      [
        `config.list.columns.data.${column.id}.width`,
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        'config.list.columns.resizer.inRealTime'
      ],
      (value, path) => {
        const list = state.get('config.list');
        calculatedWidth = column.width * list.columns.percent * 0.01;
        width = 'width:' + calculatedWidth + 'px';
        dotsWidth = `width: ${list.columns.resizer.width}px`;
        inRealTime = list.columns.resizer.inRealTime;
      }
    )
  );

  let dots = [1, 2, 3, 4, 5, 6, 7, 8];
  onDestroy(
    state.subscribe('config.list.columns.resizer.dots', value => {
      dots = new Array(value);
    })
  );

  let isMoving = false;
  let left = calculatedWidth;
  let lineStyle = `--display: none; --left: ${left}px;`;
  const columnWidthPath = `config.list.columns.data.${column.id}.width`;

  $: {
    if (isMoving) {
      lineStyle = `--display:block; --left: ${left}px;`;
    } else {
      lineStyle = `--display:none; --left: 0px;`;
    }
  }

  function onMouseDown(event) {
    isMoving = true;
    state.update('_internal.list.columns.resizer.active', true);
  }

  function onMouseMove(event) {
    if (isMoving) {
      left += event.movementX;
      if (left < 0) {
        left = 0;
      }
      if (inRealTime) {
        state.update(columnWidthPath, left);
      }
    }
  }

  function onMouseUp(event) {
    if (isMoving) {
      state.update('_internal.list.columns.resizer.active', false);
      state.update(columnWidthPath, left);
      isMoving = false;
    }
  }
</script>

<div class={className} use:action={{ column, api, state }}>
  <div class={containerClass}>
    <slot />
  </div>
  <div class={dotsClass} style="--{dotsWidth}" on:mousedown={onMouseDown}>
    {#each dots as dot}
      <div class={dotClass} />
    {/each}
  </div>
</div>
{#if !inRealTime}
  <div class={lineClass} style={lineStyle} />
{/if}
<svelte:body on:mousemove={onMouseMove} on:mouseup={onMouseUp} on:mouseleave={onMouseUp} />
