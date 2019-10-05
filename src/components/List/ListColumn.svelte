<script>
  export let columnId;
  export let visibleRows;

  import { getContext, onDestroy } from 'svelte';
  import ListColumnRow from './ListColumnRow.svelte';
  import ListColumnHeader from './ListColumnHeader.svelte';

  const api = getContext('api');
  const state = getContext('state');

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(state.subscribe(columnPath, val => (column = val)));

  const componentName = 'list-column';
  const action = api.getAction(componentName);
  let className,
    classNameContainer,
    rows = [],
    calculatedWidth,
    width,
    styleContainer;
  let rowsElement = {};
  let top = 0;

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      classNameContainer = api.getClass(componentName + '-rows', { column });
    })
  );

  onDestroy(
    state.subscribeAll(
      [
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        'config.height',
        'config.headerHeight'
      ],
      (value, path) => {
        const list = state.get('config.list');
        calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
        width = `width: ${calculatedWidth + list.columns.resizer.width}px`;
        styleContainer = `height: ${state.get('_internal.height')}px`;
      },
      { bulk: true }
    )
  );
</script>

<div class={className} use:action={{ column, api, state }} style={width}>
  <ListColumnHeader {column} />
  <div class={classNameContainer} style={styleContainer} bind:this={rowsElement}>
    {#each visibleRows as row (row.id)}
      <ListColumnRow rowId={row.id} {columnId} />
    {/each}
  </div>
</div>
