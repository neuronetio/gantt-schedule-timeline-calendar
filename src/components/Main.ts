export default function Main(input = {}) {
  return core => {
    const componentName = core.api.name;

    let pluginsPath = 'config.plugins';
    core.onDestroy(
      core.state.subscribe(pluginsPath, plugins => {
        if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
          for (const plugin of plugins) {
            plugin(core.state, core.api);
          }
        }
      })
    );

    const action = core.api.getAction('');
    let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
    let verticalScrollBarElement;
    let expandedHeight = 0;
    let resizerActive = false;

    core.onDestroy(
      core.state.subscribe('config.classNames', classNames => {
        const config = core.state.get('config');
        className = core.api.getClass(core.api.name, { config });
        if (resizerActive) {
          className += ` ${core.api.name}__list-column-header-resizer--active`;
        }
        classNameVerticalScroll = core.api.getClass('vertical-scroll', { config });
        core.render();
      })
    );

    core.onDestroy(
      core.state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], () => {
        const config = core.state.get('config');
        const scrollBarHeight = core.state.get('_internal.scrollBarHeight');
        const height = config.height - config.headerHeight - scrollBarHeight;
        core.state.update('_internal.height', height);
        style = `--height: ${config.height}px`;
        styleVerticalScroll = `height: ${height}px; width: ${scrollBarHeight}px; margin-top: ${config.headerHeight}px;`;
        core.render();
      })
    );

    core.onDestroy(
      core.state.subscribe('_internal.list.columns.resizer.active', active => {
        resizerActive = active;
        className = core.api.getClass(core.api.name);
        if (resizerActive) {
          className += ` ${core.api.name}__list-column-header-resizer--active`;
        }
        core.render();
      })
    );

    core.onDestroy(
      core.state.subscribeAll(
        ['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'],
        (bulk, eventInfo) => {
          if (core.state.get('_internal.flatTreeMap').length && eventInfo.type === 'subscribe') {
            return;
          }
          const configRows = core.state.get('config.list.rows');
          const rows = [];
          for (const rowId in configRows) {
            rows.push(configRows[rowId]);
          }
          core.api.fillEmptyRowValues(rows);
          const configItems = core.state.get('config.chart.items');
          const items = [];
          for (const itemId in configItems) {
            items.push(configItems[itemId]);
          }
          const treeMap = core.api.makeTreeMap(rows, items);
          core.state.update('_internal.treeMap', treeMap);
          core.state.update('_internal.flatTreeMapById', core.api.getFlatTreeMapById(treeMap));
          core.state.update('_internal.flatTreeMap', core.api.flattenTreeMap(treeMap));
          core.render();
        },
        { bulk: true }
      )
    );

    core.onDestroy(
      core.state.subscribeAll(
        ['config.list.rows.*.expanded', '_internal.treeMap;'],
        bulk => {
          const configRows = core.state.get('config.list.rows');
          const rowsWithParentsExpanded = core.api.getRowsFromIds(
            core.api.getRowsWithParentsExpanded(
              core.state.get('_internal.flatTreeMap'),
              core.state.get('_internal.flatTreeMapById'),
              configRows
            ),
            configRows
          );
          expandedHeight = core.api.getRowsHeight(rowsWithParentsExpanded);
          core.state.update('_internal.list.expandedHeight', expandedHeight);
          core.state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
          core.render();
        },
        { bulk: true }
      )
    );

    core.onDestroy(
      core.state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
        const visibleRows = core.api.getVisibleRows(core.state.get('_internal.list.rowsWithParentsExpanded'));
        core.state.update('_internal.list.visibleRows', visibleRows);
        core.render();
      })
    );

    core.onDestroy(
      core.state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
        const top = core.state.get('config.scroll.top');
        styleVerticalScrollArea = `height: ${expandedHeight}px; width: 1px`;
        if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
          verticalScrollBarElement.scrollTop = top;
        }
        core.render();
      })
    );

    function generateAndAddDates(internalTime, chartWidth) {
      const dates = [];
      let leftGlobal = internalTime.leftGlobal;
      const rightGlobal = internalTime.rightGlobal;
      const timePerPixel = internalTime.timePerPixel;
      const period = internalTime.period;
      let sub = leftGlobal - core.api.time.date(leftGlobal).startOf(period);
      let subPx = sub / timePerPixel;
      let leftPx = 0;
      let maxWidth = 0;
      let id = 0;
      while (leftGlobal < rightGlobal) {
        const date = {
          id: id++,
          sub,
          subPx,
          leftGlobal,
          rightGlobal: core.api.time
            .date(leftGlobal)
            .endOf(period)
            .valueOf()
        };
        date.width = (date.rightGlobal - date.leftGlobal + sub) / timePerPixel;
        if (date.width > chartWidth) {
          date.width = chartWidth;
        }
        maxWidth = date.width > maxWidth ? date.width : maxWidth;
        date.leftPx = leftPx;
        leftPx += date.width;
        date.rightPx = leftPx;
        dates.push(date);
        leftGlobal = date.rightGlobal + 1;
        sub = 0;
        subPx = 0;
      }
      internalTime.maxWidth = maxWidth;
      internalTime.dates = dates;
    }

    core.onDestroy(
      core.state.subscribeAll(
        [
          'config.chart.time',
          '_internal.dimensions.width',
          'config.scroll.left',
          '_internal.scrollBarHeight',
          '_internal.list.width'
        ],
        function recalculateTimesAction() {
          const chartWidth = core.state.get('_internal.dimensions.width') - core.state.get('_internal.list.width');
          const chartInnerWidth = chartWidth - core.state.get('_internal.scrollBarHeight');
          core.state.update('_internal.chart.dimensions', { width: chartWidth, innerWidth: chartInnerWidth });
          let time = core.api.mergeDeep({}, core.state.get('config.chart.time'));
          time = core.api.time.recalculateFromTo(time);
          const zoomPercent = time.zoom * 0.01;
          let scrollLeft = core.state.get('config.scroll.left');
          time.timePerPixel = zoomPercent + Math.pow(2, time.zoom);
          time.totalViewDurationMs = core.api.time.date(time.to).diff(time.from, 'milliseconds');
          time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
          if (scrollLeft > time.totalViewDurationPx) {
            scrollLeft = time.totalViewDurationPx - chartWidth;
          }
          time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
          time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
          time.leftInner = time.leftGlobal - time.from;
          time.rightInner = time.rightGlobal - time.from;
          time.leftPx = time.leftInner / time.timePerPixel;
          time.rightPx = time.rightInner / time.timePerPixel;
          if (Math.round(time.rightGlobal / time.timePerPixel) > Math.round(time.to / time.timePerPixel)) {
            time.rightGlobal = time.to;
            time.rightInner = time.rightGlobal - time.from;
            time.totalViewDurationMs = time.to - time.from;
            time.totalViewDurationPx = time.rightPx;
            time.timePerPixel = time.totalViewDurationMs / time.totalViewDurationPx;
          }
          generateAndAddDates(time, chartWidth);
          core.state.update(`_internal.chart.time`, time);
          core.render();
        }
      )
    );

    core.state.update('_internal.scrollBarHeight', core.api.getScrollBarHeight());

    function onScroll(event) {
      core.state.update('config.scroll.top', event.target.scrollTop);
    }

    const dimensions = { width: 0, height: 0 };
    const mainAction = element => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (dimensions.width !== width || dimensions.height !== height) {
        console.log(element, dimensions);
        dimensions.width = width;
        dimensions.height = height;
        core.state.update('_internal.dimensions', dimensions);
      }
      if (typeof action === 'function') {
        action(element);
      }
    };

    return props =>
      core.html`<div class="${className}" @scroll=${onScroll} data-action="${core.action(mainAction)}" >Main</div>`;
  };
}

/*


<div

  {style}
  bind:clientWidth={dimensions.width}
  bind:clientHeight={dimensions.height}>
  <List />
  <Chart />
  <div
    class={classNameVerticalScroll}
    style={styleVerticalScroll}
    on:scroll={onScroll}
    bind:this={verticalScrollBarElement}>
    <div style={styleVerticalScrollArea} />
  </div>
</div>
*/
