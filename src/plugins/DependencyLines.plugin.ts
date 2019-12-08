/**
 * DependencyLines plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export type Type = 'straight' | 'quadratic' | 'cubic';

export interface Options {
  type: Type;
}

const defaultOptions: Options = {
  type: 'quadratic'
};

export interface Point {
  x: number;
  y: number;
}

export type Points = Point[];

/**
 * Make quadratic path
 * @param {Points} points
 * @returns {html}
 */
function makeQuadraticPath(points: Points) {}

export default function DependencyLines(options: Options = { ...defaultOptions }) {
  return function initialize(vido) {
    const state = vido.state;
    const api = vido.api;
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
