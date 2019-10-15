/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import DeepState from 'deep-state-observer';

export interface IOptions {
  element: Element;
  state: DeepState;
  onDestroy: (state: DeepState) => {};
}

export interface IProps {
  [key: string]: any;
  [id: number]: any;
}

export interface IComponentOptions {
  props?: IProps;
  tagName?: string;
}
