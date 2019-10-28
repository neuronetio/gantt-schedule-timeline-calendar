!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).ItemHold=t()}(this,(function(){"use strict";
/**
   * ItemsHold plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0
   */return function(e={}){e={...{time:1e3,movementThreshold:2,action(e,t){}},...e};const t={},n={x:0,y:0};function o(e){void 0!==t[e]&&delete t[e]}function i(i,d){function u(o){!function(o,i,d){void 0===t[o.id]&&(t[o.id]={x:d.x,y:d.y},setTimeout(()=>{if(void 0!==t[o.id]){let d=!0,u=t[o.id].x-n.x;-1===Math.sign(u)&&(u=-u);let m=t[o.id].y-n.y;-1===Math.sign(m)&&(m=-m),u>e.movementThreshold&&(d=!1),m>e.movementThreshold&&(d=!1),delete t[o.id],d&&e.action(i,o)}},e.time))}(d.item,i,o)}function m(e){n.x=e.x,n.y=e.y}return i.addEventListener("mousedown",u),document.addEventListener("mouseup",(function(){o(d.item.id)})),document.addEventListener("mousemove",m),{update(e,t){d=t},destroy(e,t){document.removeEventListener("mouseup",o),document.removeEventListener("mousemove",m),e.removeEventListener("mousedown",u)}}}return function(e,t){e.update("config.actions.chart-timeline-items-row-item",e=>(e.push(i),e))}}}));
//# sourceMappingURL=ItemHold.plugin.js.map
