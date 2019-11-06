(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GridSelection = factory());
}(this, (function () { 'use strict';

  /**
   * GridSelection plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */

  function GridSelection() {
    let state;
    let selecting = { x: -1, y: -1, data: [], elements: [] };

    function action(element, data) {
      function mouseDown(ev) {
        selecting.x = ev.x;
        selecting.y = ev.y;
      }

      function mouseMove(ev) {
        if (selecting.x === -1 && selecting.y === -1) {
          return;
        }
        if (ev.x === selecting.x || ev.y === selecting.y) {
          return;
        }
        if (!selecting.data.find(selectedData => selectedData.id === data.id)) {
          selecting.data.push(data);
        }
        const target = ev.target.closest('.gantt-schedule-timeline-calendar__chart-timeline-grid-row-block');
        if (!selecting.elements.includes(target)) {
          selecting.elements.push(target);
        }
        console.log(selecting.elements, selecting.data);
        state.update('config.plugins.gridSelection.selecting', true);
      }

      function mouseUp(ev) {
        selecting.x = -1;
        selecting.y = -1;
        selecting.data = [];
        selecting.elements = [];
        state.update('config.plugins.gridSelection.selecting', false);
      }

      element.addEventListener('mousedown', mouseDown);
      element.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
      return {
        update(element, changedData) {
          data = changedData;
        },
        destroy() {
          document.removeEventListener('mouseup', mouseUp);
          element.removeEventListener('mousemove', mouseMove);
          element.removeEventListener('mousedown', mouseDown);
        }
      };
    }

    return function initialize(State, Api) {
      state = State;
      if (typeof state.get('config.plugins.gridSelection') === 'undefined') {
        state.update('config.plugins.gridSelection', { selecting: false, selected: [] });
      }
      state.update('config.actions.chart-timeline-grid-row-block', actions => {
        actions.push(action);
        return actions;
      });
    };
  }

  return GridSelection;

})));
//# sourceMappingURL=GridSelection.plugin.js.map
