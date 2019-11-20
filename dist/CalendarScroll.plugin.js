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
      const defaultOptions = {
          speed: 1,
          hideScroll: false,
          onChange(time) { }
      };
      options = Object.assign(Object.assign({}, defaultOptions), options);
      class CalendarScrollAction {
          constructor(element, data) {
              this.isMoving = false;
              this.lastX = 0;
              this.onMouseUp = this.onMouseUp.bind(this);
              this.onMouseMove = this.onMouseMove.bind(this);
              this.onMouseDown = this.onMouseDown.bind(this);
              element.addEventListener('mousedown', this.onMouseDown);
              document.addEventListener('mousemove', this.onMouseMove);
              document.addEventListener('mouseup', this.onMouseUp);
              element.style.cursor = 'move';
              // @ts-ignore
              if (options.hideScroll) {
                  state.get('_internal.elements.horizontal-scroll').style.visibility = 'hidden';
              }
          }
          onMouseDown(ev) {
              this.isMoving = true;
              this.lastX = ev.x;
          }
          onMouseUp(ev) {
              this.isMoving = false;
          }
          onMouseMove(ev) {
              if (!this.isMoving)
                  return;
              const movedX = ev.x - this.lastX;
              const time = state.get('_internal.chart.time');
              // @ts-ignore
              const movedTime = -Math.round(movedX * time.timePerPixel * options.speed);
              state.update('config.chart.time', configTime => {
                  if (configTime.from === 0)
                      configTime.from = time.from;
                  if (configTime.to === 0)
                      configTime.to = time.to;
                  configTime.from += movedTime;
                  configTime.to += movedTime;
                  // @ts-ignore
                  options.onChange(configTime);
                  return configTime;
              });
              this.lastX = ev.x;
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
