/**
 * GridSelection plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function GridSelection() {
  return function initialize(state, api) {
    state.update('config.actions.chart-timeline-grid-row-block', actions => {
      ///actions.push(action);
      return actions;
    });
  };
}
