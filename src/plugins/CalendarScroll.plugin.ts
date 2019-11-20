/**
 * CalendarScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function CalendarScroll(options = {}) {
  let state, api;

  class CalendarScrollAction {
    isMoving: boolean = false;

    constructor(element: Element, data: any) {
      element.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown(ev: MouseEvent) {
      this.isMoving = true;
    }

    onMouseUp(ev: MouseEvent) {
      this.isMoving = false;
    }

    onMouseMove(ev: MouseEvent) {
      if (!this.isMoving) return;
      console.log('moving', ev.x);
    }

    update(element: Element, data: any) {}

    destroy(element: Element, data: any) {
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
