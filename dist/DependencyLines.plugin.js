!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).DependencyLines=n()}(this,(function(){"use strict";
/**
   * DependencyLines plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */return function(e={}){return function(e){const n=e.state,t=e.api;n.update("config.wrappers.ChartTimelineGrid",e=>(function(i,o){n.get("config.chart.items");const c=o.vido.html`${i}<div class=${t.getClass("chart-timeline-dependency-lines")}>${[]}</div>`;return e(c,o)}))}}}));
//# sourceMappingURL=DependencyLines.plugin.js.map
