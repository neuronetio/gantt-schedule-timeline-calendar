(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CalendarScroll = factory());
}(this, (function () { 'use strict';

  /**
   * CalendarScroll plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  function CalendarScroll(options = {}) {
      let state, api;
      class CalendarScrollAction {
          constructor(element, data) {
              this.isMoving = false;
              element.addEventListener('mousedown', this.onMouseDown);
              document.addEventListener('mousemove', this.onMouseMove);
              document.addEventListener('mouseup', this.onMouseUp);
          }
          onMouseDown(ev) {
              this.isMoving = true;
          }
          onMouseUp(ev) {
              this.isMoving = false;
          }
          onMouseMove(ev) {
              if (!this.isMoving)
                  return;
              console.log('moving', ev.x);
          }
          update(element, data) { }
          destroy(element, data) {
              element.removeEventListener('mousedown', this.onMouseDown);
              document.removeEventListener('mousemove', this.onMouseMove);
              document.removeEventListener('mouseup', this.onMouseUp);
          }
      }
      return function initialize(vido) {
          api = vido.api;
          state = vido.state;
          state.update('config.actions.chart-calendar', actions => {
              actions.push(CalendarScrollAction);
              return actions;
          });
      };
  }

  return CalendarScroll;

})));
//# sourceMappingURL=CalendarScroll.plugin.js.map
