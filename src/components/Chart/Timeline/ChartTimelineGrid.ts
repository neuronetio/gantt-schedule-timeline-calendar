/**
 * ChartTimelineGrid component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimelineGrid(vido, props) {
  const { api, state, onDestroy, actions, update, html, reuseComponents, StyleMap } = vido;
  const componentName = 'chart-timeline-grid';
  const componentActions = api.getActions(componentName);
  const actionProps = { api, state };

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineGrid', value => (wrapper = value)));

  const GridRowComponent = state.get('config.components.ChartTimelineGridRow');

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  let period;
  onDestroy(state.subscribe('config.chart.time.period', value => (period = value)));
  let onBlockCreate;
  onDestroy(state.subscribe('config.chart.grid.block.onCreate', onCreate => (onBlockCreate = onCreate)));

  let rowsComponents = [];
  const rowsWithBlocks = [];
  const formatCache = new Map();
  const styleMap = new StyleMap({});
  /**
   * Generate blocks
   */
  const generateBlocks = () => {
    const width = state.get('_internal.chart.dimensions.width');
    const height = state.get('_internal.height');
    const periodDates = state.get(`_internal.chart.time.dates.${period}`);
    const visibleRows = state.get('_internal.list.visibleRows');
    if (!periodDates || periodDates.length === 0) {
      return;
    }
    //const compensation = periodDates[0].subPx;
    styleMap.style.height = height + 'px';
    styleMap.style.width = width + 'px';
    //styleMap.style.transform = `translate(-${compensation}px, 0px)`;

    let top = 0;
    rowsWithBlocks.length = 0;
    for (const row of visibleRows) {
      const blocks = [];
      for (const time of periodDates) {
        let format;
        if (formatCache.has(time.leftGlobal)) {
          format = formatCache.get(time.leftGlobal);
        } else {
          format = api.time.date(time.leftGlobal).format('YYYY-MM-DD');
          formatCache.set(time.leftGlobal, format);
        }
        let id = row.id + ':' + format;
        let block = { id, time, row, top };
        for (const onCreate of onBlockCreate) {
          block = onCreate(block);
        }
        blocks.push(block);
      }
      rowsWithBlocks.push({ row, blocks, top, width });
      top += row.height;
    }
    state.update('_internal.chart.grid.rowsWithBlocks', rowsWithBlocks);
  };
  onDestroy(
    state.subscribeAll(
      [
        '_internal.list.visibleRows;',
        `_internal.chart.time.dates.${period};`,
        '_internal.height',
        '_internal.chart.dimensions.width'
      ],
      generateBlocks,
      {
        bulk: true
      }
    )
  );

  /**
   * Generate rows components
   * @param {array} rowsWithBlocks
   */
  const generateRowsComponents = rowsWithBlocks => {
    if (rowsWithBlocks) {
      reuseComponents(rowsComponents, rowsWithBlocks, row => row, GridRowComponent);
      update();
    }
  };
  onDestroy(state.subscribe('_internal.chart.grid.rowsWithBlocks', generateRowsComponents));

  /**
   * Bind element
   * @param {Element} element
   */
  function bindElement(element: Element) {
    state.update('_internal.elements.chart-timeline-grid', element);
  }
  if (!componentActions.includes(bindElement)) {
    componentActions.push();
  }

  onDestroy(() => {
    rowsComponents.forEach(row => row.destroy());
  });

  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, actionProps)} style=${styleMap}>
          ${rowsComponents.map(r => r.html())}
        </div>
      `,
      { props, vido, templateProps }
    );
}
