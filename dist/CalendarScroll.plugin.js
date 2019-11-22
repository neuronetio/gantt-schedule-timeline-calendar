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
      let state, api, schedule;
      const defaultOptions = {
          speed: 1,
          hideScroll: false,
          onChange(time) { }
      };
      options = Object.assign(Object.assign({}, defaultOptions), options);
      class CalendarScrollAction {
          constructor(element) {
              this.isMoving = false;
              this.lastX = 0;
              this.onPointerStart = this.onPointerStart.bind(this);
              this.onPointerMove = this.onPointerMove.bind(this);
              this.onPointerEnd = this.onPointerEnd.bind(this);
              element.addEventListener('touchstart', this.onPointerStart);
              document.addEventListener('touchmove', this.onPointerMove);
              document.addEventListener('touchend', this.onPointerEnd);
              element.addEventListener('mousedown', this.onPointerStart);
              document.addEventListener('mousemove', this.onPointerMove);
              document.addEventListener('mouseup', this.onPointerEnd);
              element.style.cursor = 'move';
              const horizontalScroll = state.get('_internal.elements.horizontal-scroll');
              // @ts-ignore
              if (options.hideScroll && horizontalScroll) {
                  horizontalScroll.style.visibility = 'hidden';
              }
          }
          onPointerStart(ev) {
              if (ev.type === 'mousedown' && ev.button !== 0)
                  return;
              ev.stopPropagation();
              this.isMoving = true;
              const normalized = api.normalizePointerEvent(ev);
              this.lastX = normalized.x;
          }
          onPointerMove(ev) {
              schedule(() => {
                  if (!this.isMoving)
                      return;
                  const normalized = api.normalizePointerEvent(ev);
                  const movedX = normalized.x - this.lastX;
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
                  this.lastX = normalized.x;
              })();
          }
          onPointerEnd(ev) {
              this.isMoving = false;
              this.lastX = 0;
          }
          destroy(element, data) {
              element.removeEventListener('touchstart', this.onPointerStart);
              document.removeEventListener('touchmove', this.onPointerMove);
              document.removeEventListener('touchend', this.onPointerEnd);
              element.removeEventListener('mousedown', this.onPointerStart);
              document.removeEventListener('mousemove', this.onPointerMove);
              document.removeEventListener('mouseup', this.onPointerEnd);
          }
      }
      return function initialize(vido) {
          api = vido.api;
          state = vido.state;
          schedule = vido.schedule;
          state.update('config.actions.chart-calendar', actions => {
              actions.push(CalendarScrollAction);
              return actions;
          });
      };
  }

  return CalendarScroll;

})));
//# sourceMappingURL=CalendarScroll.plugin.js.map
