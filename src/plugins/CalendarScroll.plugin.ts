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
  const defaultOptions = {
    speed: 1,
    hideScroll: false,
    onChange(time) {}
  };
  options = { ...defaultOptions, ...options };

  class CalendarScrollAction {
    isMoving: boolean = false;
    lastX: number = 0;
    mc: any;

    constructor(element: HTMLElement, data: any) {
      this.onPanStart = this.onPanStart.bind(this);
      this.onPanMove = this.onPanMove.bind(this);
      this.onPanEnd = this.onPanEnd.bind(this);
      this.mc = new api.Hammer(element);
      this.mc.on('panstart', this.onPanStart);
      this.mc.on('panmove', this.onPanMove);
      this.mc.on('panend', this.onPanEnd);
      element.style.cursor = 'move';
      // @ts-ignore
      if (options.hideScroll) {
        state.get('_internal.elements.horizontal-scroll').style.visibility = 'hidden';
      }
    }

    onPanStart(ev) {
      this.isMoving = true;
      this.lastX = ev.deltaX;
    }

    onPanMove(ev) {
      const movedX = ev.deltaX - this.lastX;
      const time = state.get('_internal.chart.time');
      // @ts-ignore
      const movedTime = -Math.round(movedX * time.timePerPixel * options.speed);
      state.update('config.chart.time', configTime => {
        if (configTime.from === 0) configTime.from = time.from;
        if (configTime.to === 0) configTime.to = time.to;
        configTime.from += movedTime;
        configTime.to += movedTime;
        // @ts-ignore
        options.onChange(configTime);
        return configTime;
      });
      this.lastX = ev.deltaX;
    }

    onPanEnd(ev) {
      this.isMoving = false;
      this.lastX = 0;
    }

    destroy(element: HTMLElement, data: any) {
      this.mc.off(element);
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
