<script>
  import { getContext, onDestroy, onMount } from 'svelte';
  import Calendar from './Calendar/Calendar.svelte';
  import Gantt from './Gantt/Gantt.svelte';

  const api = getContext('api');
  const state = getContext('state');
  const componentName = 'chart';

  let className,
    classNameScroll,
    classNameScrollInner,
    config,
    scrollElement,
    styleScroll = '',
    styleScrollInner = '',
    action = api.getAction(componentName);

  onDestroy(
    state.subscribe('config.classNames', value => {
      config = value;
      className = api.getClass(componentName);
      classNameScroll = api.getClass('horizontal-scroll');
      classNameScrollInner = api.getClass('horizontal-scroll-inner');
    })
  );
  onDestroy(
    state.subscribe('config.scroll.left', left => {
      if (scrollElement && scrollElement.scrollLeft !== left) {
        scrollElement.scrollLeft = left;
      }
    })
  );

  onDestroy(
    state.subscribeAll(['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'], function horizontalScroll(
      value,
      eventInfo
    ) {
      styleScroll = `width: ${state.get('_internal.chart.dimensions.width')}px`;
      styleScrollInner = `width: ${state.get('_internal.chart.time.totalViewDurationPx')}px; height:1px`;
    })
  );

  onMount(() => {
    //state.update('config.scroll.left', scrollElement.scrollLeft);
  });

  function onScroll(event) {
    if (event.type === 'scroll') {
      state.update('config.scroll.left', event.target.scrollLeft);
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      const xMultiplier = state.get('config.scroll.xMultiplier');
      const yMultiplier = state.get('config.scroll.yMultiplier');
      if (event.shiftKey && wheel.y) {
        state.update('config.scroll.left', left => {
          return api.limitScroll('left', (left += wheel.y * xMultiplier));
        });
      } else if (wheel.x) {
        state.update('config.scroll.left', left => {
          return api.limitScroll('left', (left += wheel.x * xMultiplier));
        });
      } else {
        state.update('config.scroll.top', top => {
          return api.limitScroll('top', (top += wheel.y * yMultiplier));
        });
      }
    }
  }
</script>

<div class={className} use:action={{ api, state }} on:wheel={onScroll}>
  <Calendar />
  <Gantt />
  <div class={classNameScroll} style={styleScroll} bind:this={scrollElement} on:scroll={onScroll}>
    <div class={classNameScrollInner} style={styleScrollInner} />
  </div>
</div>
