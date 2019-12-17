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
      handle: {
          style: {},
          width: 40,
          height: 40
      },
      connector: {
          style: {},
          width: 40,
          height: 40
      }
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
   * Are we connecting the dots?
   */
  let connecting = false;
  /**
   * Item dependency line handle
   * @param vido
   * @param props
   */
  function ItemDependencyLineHandle(vido, props) {
      const { html, onDestroy, api, state, StyleMap, onChange, Detach, update, Actions, PointerAction } = vido;
      const componentName = 'chart-timeline-dependency-lines-handle';
      const connectorName = componentName + '--connector';
      const actionProps = Object.assign({}, props);
      let className, connectorClassName;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
          connectorClassName = api.getClass(connectorName);
      }));
      let shouldDetach = false;
      const detach = new Detach(() => shouldDetach);
      const connectorDetach = new Detach(() => shouldDetach || !connecting || connecting === props.item.id);
      const styleMap = new StyleMap({
          left: '0px',
          top: '0px',
          width: opts.handle.width + 'px',
          height: opts.handle.height + 'px'
      });
      const connectorStyleMap = new StyleMap({
          left: '0px',
          top: '0px',
          width: opts.connector.width + 'px',
          height: opts.connector.height + 'px'
      });
      function updatePosition() {
          styleMap.style.left = api.time.globalTimeToViewPixelOffset(props.item.time.end, true) + 'px';
          styleMap.style.top = props.row.top + 'px';
          connectorStyleMap.style.left =
              api.time.globalTimeToViewPixelOffset(props.item.time.start, true) - opts.connector.width - 1 + 'px';
          connectorStyleMap.style.top = props.row.top + 'px';
          for (const name in opts.handle.style) {
              styleMap.style[name] = opts.handle.style[name];
          }
          for (const name in opts.connector.style) {
              connectorStyleMap.style[name] = opts.connector.style[name];
          }
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
      const componentActions = api.getActions(componentName);
      actionProps.pointerOptions = {
          axis: 'xy',
          onDown({ event }) {
              event.stopPropagation();
              event.preventDefault();
              connecting = props.item.id;
              update();
          },
          onMove({ event, movementX, movementY }) {
              if (connecting) {
                  event.stopPropagation();
                  event.preventDefault();
                  console.log('move?', { movementX, movementY });
                  update();
              }
          },
          onUp({ event }) {
              if (connecting) {
                  event.stopPropagation();
                  event.preventDefault();
                  connecting = false;
                  update();
              }
          }
      };
      componentActions.push(PointerAction);
      const actions = Actions.create(componentActions, actionProps);
      return templateProps => html `
      <div detach=${detach} class=${className} style=${styleMap} data-actions=${actions}></div>
      <div detach=${connectorDetach} class=${connectorClassName} style=${connectorStyleMap}></div>
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
      return function initialize(vido) {
          state = vido.state;
          api = vido.api;
          defaultOptions.connector.width = defaultOptions.connector.height = state.get('config.list.rowHeight') || 40;
          opts = Object.assign(Object.assign({}, defaultOptions), options);
          opts.connector = Object.assign(Object.assign({}, defaultOptions.connector), opts.connector);
          opts.connector.style = Object.assign(Object.assign({}, defaultOptions.connector.style), opts.connector.style);
          opts.handle = Object.assign(Object.assign({}, defaultOptions.handle), opts.handle);
          opts.handle.style = Object.assign(Object.assign({}, defaultOptions.handle.style), opts.handle.style);
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
