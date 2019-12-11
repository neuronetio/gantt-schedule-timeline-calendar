(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.DependencyLines = factory());
}(this, (function () { 'use strict';

  /**
   * DependencyLines plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  let opts;
  let state, api;
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = 'var(--width)';
  container.style.height = 'var(--height)';
  const defaultOptions = {
      type: 'quadratic',
      style: {},
      width: 16,
      height: 16
  };
  /**
   * Item dependency line component
   * @param vido
   * @param props
   */
  function ItemDependencyLine(vido, props) {
      const { state, onDestroy, onChange, html, svg, Detach, update, StyleMap } = vido;
      const componentName = 'chart-timeline-items-row-item-dependency';
      let classNameLine, classNameHandle;
      onDestroy(state.subscribe('config.classNames', () => {
          classNameLine = api.getClass(componentName + '-line');
          classNameHandle = api.getClass(componentName + '-handle');
      }));
      let wrapper;
      onDestroy(state.subscribe('config.wrappers.DependencyLineRightHandle', value => {
          if (value) {
              wrapper = value;
          }
          else {
              wrapper = function DependencyLineRightHandleWrapper(input) {
                  return input;
              };
          }
      }));
      let shouldDetach = false;
      const detach = new Detach(() => shouldDetach);
      const styleMapHandle = new StyleMap({});
      const styleMapLine = new StyleMap({});
      let lines = [];
      function updateLines() {
          var _a, _b;
          lines.length = 0;
          const itemIds = ((_b = (_a = props) === null || _a === void 0 ? void 0 : _a.item) === null || _b === void 0 ? void 0 : _b.lines) || [];
          const items = state.get('config.chart.items');
          const rows = state.get('config.list.rows');
          for (const itemId of itemIds) {
              const currentItem = items[itemId];
              if (!currentItem)
                  continue;
              const currentRow = rows[currentItem.rowId];
              if (!currentRow)
                  continue;
              const width = Math.abs(props.width + (props.item.time.start - currentItem.time.start) / timePerPixel);
              const height = Math.abs(props.row.top - currentRow.top) + currentRow.height;
              const line = svg `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>`;
              lines.push(line);
          }
      }
      let timePerPixel = 1;
      onDestroy(state.subscribe('_internal.chart.time.timePerPixel', value => {
          timePerPixel = value || 1;
          updateLines();
      }));
      onChange(function onChange(changedProps, options) {
          if (options.leave || !changedProps) {
              shouldDetach = true;
              return update();
          }
          shouldDetach = false;
          props = changedProps;
          styleMapHandle.style['left'] = props.left + props.width - opts.width + 'px';
          styleMapHandle.style['width'] = opts.width + 'px';
          styleMapHandle.style['height'] = opts.height + 'px';
          styleMapLine.style['left'] = props.left + props.width + 'px';
          updateLines();
          update();
      });
      return templateProps => wrapper(html `
        <div detach=${detach} class=${classNameLine} style=${styleMapLine}>${lines.map(line => line)}</div>
      `, { templateProps, props, vido });
  }
  /**
   * Dependency Lines Component
   * @param vido
   */
  function DependencyLinesComponent(vido) {
      const { html, onDestroy, api, state, reuseComponents } = vido;
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass('chart-timeline-dependency-lines');
      }));
      let lines = [];
      onDestroy(state.subscribe('config.chart.items', items => {
          const itemsArray = Object.values(items);
          return reuseComponents(lines, itemsArray, item => item, ItemDependencyLine);
      }));
      return templateProps => html `
      <div class="${className}">${lines.map(line => line.html())}</div>
    `;
  }
  function DependencyLinesPlugin(options = defaultOptions) {
      opts = Object.assign(Object.assign({}, defaultOptions), options);
      return function initialize(vido) {
          state = vido.state;
          api = vido.api;
          const DependencyLines = vido.createComponent(DependencyLinesComponent);
          state.update('config.wrappers.ChartTimelineGrid', gridWrapper => {
              return function DependencyLinesGridWrapper(input, data) {
                  const output = vido.html `${input}${DependencyLines.html()}`;
                  return gridWrapper(output, data);
              };
          });
          return function destroy() {
              DependencyLines.destroy();
          };
      };
  }

  return DependencyLinesPlugin;

})));
//# sourceMappingURL=DependencyLines.plugin.js.map
