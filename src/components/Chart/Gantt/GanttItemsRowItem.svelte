<script>
  export let rowId;
  export let itemId;

  import { getContext, onDestroy } from 'svelte';

  const api = getContext('api');
  const state = getContext('state');

  let row,
    rowPath = `config.list.rows.${rowId}`;
  onDestroy(state.subscribe(rowPath, value => (row = value)));
  let item,
    itemPath = `config.chart.items.${itemId}`;
  onDestroy(state.subscribe(itemPath, value => (item = value)));

  $: {
    rowPath = `config.list.rows.${rowId}`;
    row = state.get(rowPath);
    itemPath = `config.chart.items.${itemId}`;
    item = state.get(itemPath);
    updateRowLeftOffset();
  }

  const componentName = 'chart-gantt-items-row-item';
  const action = api.getAction(componentName, { row, item });
  let className = api.getClass(componentName, { row, item });
  let contentClassName = api.getClass(componentName + '-content', { row, item });
  let labelClassName = api.getClass(componentName + '-content-label', { row, item });
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { row, item });
      contentClassName = api.getClass(componentName + '-content', { row, item });
      labelClassName = api.getClass(componentName + '-content-label', { row, item });
    })
  );

  let style,
    itemLeftPx = 0,
    itemWidthPx = 0;
  function updateRowLeftOffset() {
    const time = state.get('_internal.chart.time');
    itemLeftPx = (item.time.start - time.from) / time.timePerPixel;
    itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
    style = `left:${itemLeftPx}px;width:${itemWidthPx}px;`;
  }

  onDestroy(state.subscribe('_internal.chart.time', updateRowLeftOffset, { bulk: true }));
</script>

<div class={className} use:action={{ item, row, left: itemLeftPx, width: itemWidthPx, api, state }} {style}>
  <div class={contentClassName}>
    <div class={labelClassName}>{item.label}</div>
  </div>
</div>
