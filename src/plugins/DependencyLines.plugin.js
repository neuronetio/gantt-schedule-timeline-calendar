/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function DependencyLinesPlugin(options = {}) {
  return function DependencyLines(state, api) {
    state.update('config.wrappers.ChartTimelineGrid', wrapper => {
      return function DependencyLinesWrapper(input, data) {
        const lines = [];
        const items = state.get('config.chart.items');
        const output = data.vido.html`${input}<div class=${api.getClass(
          'chart-timeline-dependency-lines'
        )}>${lines}</div>`;
        return wrapper(output, data);
      };
    });
  };
}
