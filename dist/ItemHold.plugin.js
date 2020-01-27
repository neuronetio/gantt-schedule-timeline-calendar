(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ItemHold = factory());
}(this, (function () { 'use strict';

  /**
   * ItemHold plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  function ItemHold(options = {}) {
      let api;
      const defaultOptions = {
          time: 1000,
          movementThreshold: 2,
          action(element, data) { }
      };
      options = Object.assign(Object.assign({}, defaultOptions), options);
      const holding = {};
      const pointer = { x: 0, y: 0 };
      function onPointerDown(item, element, event) {
          if (typeof holding[item.id] === 'undefined') {
              const normalized = api.normalizePointerEvent(event);
              holding[item.id] = { x: normalized.x, y: normalized.y };
              event.stopPropagation();
              event.preventDefault();
              setTimeout(() => {
                  if (typeof holding[item.id] !== 'undefined') {
                      let exec = true;
                      const xMovement = Math.abs(holding[item.id].x - pointer.x);
                      const yMovement = Math.abs(holding[item.id].y - pointer.y);
                      if (xMovement > options.movementThreshold) {
                          exec = false;
                      }
                      if (yMovement > options.movementThreshold) {
                          exec = false;
                      }
                      delete holding[item.id];
                      if (exec) {
                          options.action(element, item);
                      }
                  }
              }, options.time);
          }
      }
      function onPointerUp(itemId) {
          if (typeof holding[itemId] !== 'undefined') {
              delete holding[itemId];
          }
      }
      function action(element, data) {
          function elementPointerDown(event) {
              onPointerDown(data.item, element, event);
          }
          element.addEventListener('mousedown', elementPointerDown);
          element.addEventListener('touchstart', elementPointerDown);
          function pointerUp() {
              onPointerUp(data.item.id);
          }
          document.addEventListener('mouseup', pointerUp);
          document.addEventListener('touchend', pointerUp);
          function onPointerMove(event) {
              const normalized = api.normalizePointerEvent(event);
              pointer.x = normalized.x;
              pointer.y = normalized.y;
          }
          document.addEventListener('mousemove', onPointerMove);
          document.addEventListener('touchmove', onPointerMove);
          return {
              update(element, changedData) {
                  data = changedData;
              },
              destroy(element, data) {
                  document.removeEventListener('mouseup', onPointerUp);
                  document.removeEventListener('mousemove', onPointerMove);
                  element.removeEventListener('mousedown', elementPointerDown);
                  document.removeEventListener('touchend', onPointerUp);
                  document.removeEventListener('touchmove', onPointerMove);
                  element.removeEventListener('touchstart', elementPointerDown);
              }
          };
      }
      return function initialize(vido) {
          api = vido.api;
          vido.state.update('config.actions.chart-timeline-items-row-item', actions => {
              actions.push(action);
              return actions;
          });
      };
  }

  return ItemHold;

})));
//# sourceMappingURL=ItemHold.plugin.js.map
