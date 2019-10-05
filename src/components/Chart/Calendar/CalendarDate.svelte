<script>
  export let date;

  import { getContext, onDestroy } from 'svelte';

  const state = getContext('state');
  const api = getContext('api');

  const componentName = 'chart-calendar-date';
  const action = api.getAction(componentName);
  let className,
    formattedClassName,
    formattedYearClassName,
    formattedMonthClassName,
    formattedDayClassName,
    formattedDayWordClassName;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { date });
      formattedClassName = api.getClass(`${componentName}-formatted`, { date });
      formattedYearClassName = api.getClass(`${componentName}-formatted-year`, { date });
      formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, { date });
      formattedDayClassName = api.getClass(`${componentName}-formatted-day`, { date });
      formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, { date });
    })
  );

  let time, period, small, smallFormatted, year, month, day, dayWord, style;
  onDestroy(
    state.subscribeAll(
      ['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'],
      function renderDate() {
        time = state.get('_internal.chart.time');
        period = time.period;
        const dateMod = api.time.date(date.leftGlobal);
        const maxWidth = time.maxWidth;
        small = maxWidth <= 40;
        const smallFormat = state.get('config.chart.calendar.vertical.smallFormat');
        smallFormatted = dateMod.format(smallFormat);
        year = dateMod.format('YYYY');
        month = dateMod.format('MMMM');
        day = dateMod.format('DD');
        dayWord = dateMod.format('dddd');
        if (maxWidth <= 70) {
          year = dateMod.format('YY');
          month = dateMod.format('MMM');
          day = dateMod.format('DD');
          dayWord = dateMod.format('ddd');
        } else if (maxWidth <= 150) {
          dayWord = dateMod.format('ddd');
        }
      },
      { bulk: true }
    )
  );
  $: daySize = time.zoom <= 22 ? 18 : 13;
  $: style = `width: ${date.width}px; margin-left:-${date.subPx}px; --day-size: ${daySize}px`;
</script>

<div class={className} {style} use:action={{ date, api, state }}>
  {#if small}
    <div class={formattedClassName} style="transform: rotate(90deg);">{smallFormatted}</div>
  {:else}
    <div class={formattedClassName}>
      <div class={formattedYearClassName}>{year}</div>
      <div class={formattedMonthClassName}>{month}</div>
      <div class={formattedDayClassName}>{day}</div>
      <div class={formattedDayWordClassName}>{dayWord}</div>
    </div>
  {/if}
</div>
