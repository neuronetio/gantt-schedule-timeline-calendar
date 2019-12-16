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
   * DependencyLines Lines Component
   * @param vido
   */
  function DependencyLinesLines(vido) {
      const { html, onDestroy, api, state, reuseComponents } = vido;
      const componentName = 'chart-timeline-dependency-lines-lines';
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
      }));
      let lines = [];
      onDestroy(state.subscribe('_internal.chart.visibleItems', visibleItems => {
          const allRows = state.get('config.list.rows');
          const rows = {};
          for (const itemId in visibleItems) {
              const item = visibleItems[itemId];
              if (typeof item.rowId === 'string' && allRows[item.rowId]) {
                  rows[item.rowId] = allRows[item.rowId];
              }
          }
      }));
      return templateProps => html `
      <div class="${className}">${lines.map(line => line.html())}</div>
    `;
  }
  /**
   * Item dependency line handle
   * @param vido
   * @param props
   */
  function ItemDependencyLineHandle(vido, props) {
      const { html, onDestroy, api, state, StyleMap, onChange, Detach, update, Actions, PointerAction } = vido;
      const componentName = 'chart-timeline-dependency-lines-handle';
      const actionProps = Object.assign({}, props);
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
      }));
      let shouldDetach = false;
      const detach = new Detach(() => shouldDetach);
      const styleMap = new StyleMap({ left: '0px', top: '0px', width: opts.width + 'px', height: opts.height + 'px' });
      function updatePosition() {
          styleMap.style.left = api.time.globalTimeToViewPixelOffset(props.item.time.end, true) - opts.width + 'px';
          styleMap.style.top = props.row.top + 'px';
      }
      function change(changedProps, options) {
          if (options.leave) {
              shouldDetach = true;
              return update();
          }
          shouldDetach = false;
          props = changedProps;
          for (const prop in props) {
              actionProps[prop] = props[prop];
          }
          updatePosition();
          update();
      }
      onChange(change);
      onDestroy(state.subscribeAll(['_internal.chart.time', 'config.scroll.compensation'], () => {
          updatePosition();
          update();
      }));
      const componentActions = api.getActions(componentName) || [];
      let moving = false;
      actionProps.pointerOptions = {
          axis: 'xy',
          onDown({ event }) {
              event.stopPropagation();
              event.preventDefault();
              moving = true;
          },
          onMove({ event, movementX, movementY }) {
              if (moving) {
                  event.stopPropagation();
                  event.preventDefault();
                  console.log('move?', { movementX, movementY });
              }
          }
      };
      componentActions.push(PointerAction);
      const actions = Actions.create(componentActions, actionProps);
      return templateProps => html `
      <div detach=${detach} class=${className} style=${styleMap} data-actions=${actions}></div>
    `;
  }
  /**
   * DependencyLines Handles Component
   * @param vido
   */
  function DependencyLinesHandles(vido) {
      const { html, onDestroy, api, state, reuseComponents } = vido;
      const componentName = 'chart-timeline-dependency-lines-handles';
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
      }));
      const handles = [];
      onDestroy(state.subscribe('_internal.chart.visibleItems', visibleItems => {
          const handlesProps = [];
          const allRows = state.get('config.list.rows');
          for (const item of visibleItems) {
              // @ts-ignore
              const row = allRows[item.rowId];
              if (!row)
                  continue;
              handlesProps.push({
                  item: item,
                  row
              });
          }
          return reuseComponents(handles, handlesProps, prop => prop, ItemDependencyLineHandle);
      }));
      return templateProps => html `
      <div class="${className}">${handles.map(handle => handle.html())}</div>
    `;
  }
  function DependencyLinesPlugin(options = defaultOptions) {
      opts = Object.assign(Object.assign({}, defaultOptions), options);
      return function initialize(vido) {
          state = vido.state;
          api = vido.api;
          const Lines = vido.createComponent(DependencyLinesLines);
          state.update('config.wrappers.ChartTimelineGrid', gridWrapper => {
              return function DependencyLinesGridWrapper(input, data) {
                  const output = vido.html `${input}${Lines.html()}`;
                  return gridWrapper(output, data);
              };
          });
          const Handles = vido.createComponent(DependencyLinesHandles);
          state.update('config.wrappers.ChartTimelineItems', itemsWrapper => {
              return function DependencyLinesItemsWrapper(input, data) {
                  const output = vido.html `${input}${Handles.html()}`;
                  return itemsWrapper(output, data);
              };
          });
          return function destroy() {
              Lines.destroy();
              Handles.destroy();
          };
      };
  }

  return DependencyLinesPlugin;

})));
//# sourceMappingURL=DependencyLines.plugin.js.map
