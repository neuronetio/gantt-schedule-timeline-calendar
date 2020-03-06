/**
 * CalendarScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import { Action } from '@neuronet.io/vido';

export interface Options {
  speed?: number;
  hideScroll?: boolean;
  onChange?: (time) => void;
}

export default function CalendarScroll(options: Options = {}) {
  let state, api, update;
  const defaultOptions = {
    speed: 0.25,
    hideScroll: false,
    onChange(time) {}
  };
  options = { ...defaultOptions, ...options };

  class CalendarScrollAction extends Action {
    isMoving = false;
    lastX = 0;
    collectLowerThanZero = 0;

    constructor(element: HTMLElement) {
      super();
      this.onPointerStart = this.onPointerStart.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerEnd = this.onPointerEnd.bind(this);
      element.addEventListener('touchstart', this.onPointerStart);
      document.addEventListener('touchmove', this.onPointerMove);
      document.addEventListener('touchend', this.onPointerEnd);
      element.addEventListener('mousedown', this.onPointerStart);
      document.addEventListener('mousemove', this.onPointerMove);
      document.addEventListener('mouseup', this.onPointerEnd);
      element.style.cursor = 'move';
      const horizontalScroll = state.get('_internal.elements.horizontal-scroll');
      // @ts-ignore
      if (options.hideScroll && horizontalScroll) {
        horizontalScroll.style.visibility = 'hidden';
      }
    }

    private onPointerStart(ev) {
      if (ev.type === 'mousedown' && ev.button !== 0) return;
      ev.stopPropagation();
      this.isMoving = true;
      const normalized = api.normalizePointerEvent(ev);
      this.lastX = normalized.x;
    }

    private onPointerMove(ev) {
      if (!this.isMoving) return;
      const normalized = api.normalizePointerEvent(ev);
      const movedX = normalized.x - this.lastX;
      let finalMovement = movedX * options.speed;
      if (Math.abs(finalMovement) >= 1) {
        finalMovement = Math.round(finalMovement);
        state.update('config.chart.time', time => {
          let centerTime = api.time
            .date(time.centerGlobal)
            .add(finalMovement * -1, time.period)
            .valueOf();
          const movedTime = centerTime - time.centerGlobal;
          time.leftGlobal += movedTime;
          time.centerGlobal = centerTime;
          time.rightGlobal += movedTime;
          time.from += movedTime;
          time.to += movedTime;
          options.onChange(time);
          return time;
        });
        this.lastX = normalized.x;
      }
    }

    private onPointerEnd() {
      this.isMoving = false;
      this.lastX = 0;
    }

    public destroy(element: HTMLElement, data: any) {
      element.removeEventListener('touchstart', this.onPointerStart);
      document.removeEventListener('touchmove', this.onPointerMove);
      document.removeEventListener('touchend', this.onPointerEnd);
      element.removeEventListener('mousedown', this.onPointerStart);
      document.removeEventListener('mousemove', this.onPointerMove);
      document.removeEventListener('mouseup', this.onPointerEnd);
    }
  }

  return function initialize(vido) {
    api = vido.api;
    state = vido.state;
    update = vido.update;
    state.update('config.actions.chart-calendar', actions => {
      actions.push(CalendarScrollAction);
      return actions;
    });
  };
}
