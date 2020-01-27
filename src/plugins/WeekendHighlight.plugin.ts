/**
 * Weekend highlight plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import { Action } from '@neuronet.io/vido/vido.esm';

export interface Options {
  weekdays?: number[];
  className?: string;
}

export default function WeekendHiglight(options: Options = {}) {
  const weekdays = options.weekdays || [6, 0];
  let className;
  let api;

  class WeekendHighlightAction extends Action {
    constructor(element, data) {
      super();
      this.highlight(element, data.time.leftGlobal);
    }

    update(element, data) {
      this.highlight(element, data.time.leftGlobal);
    }

    highlight(element, time) {
      const isWeekend = weekdays.includes(api.time.date(time).day());
      const hasClass = element.classList.contains(className);
      if (!hasClass && isWeekend) {
        element.classList.add(className);
      } else if (hasClass && !isWeekend) {
        element.classList.remove(className);
      }
    }
  }

  return function initialize(vido) {
    api = vido.api;
    className = options.className || api.getClass('chart-timeline-grid-row-block') + '--weekend';
    vido.state.update('config.actions.chart-timeline-grid-row-block', actions => {
      actions.push(WeekendHighlightAction);
      return actions;
    });
  };
}
