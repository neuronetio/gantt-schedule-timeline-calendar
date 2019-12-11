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
  function DependencyLines(options = defaultOptions) {
      opts = Object.assign(Object.assign({}, defaultOptions), options);
      return function initialize(vido) {
          state = vido.state;
          api = vido.api;
          /*state.update('config.slots.chart-timeline-items-row-item.after', after => {
            if (!after.includes(ItemDependencyLine)) {
              after.push(ItemDependencyLine);
            }
            return after;
          });*/
      };
  }

  return DependencyLines;

})));
//# sourceMappingURL=DependencyLines.plugin.js.map
