/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Locale } from '../types';

export default class TimeApi {
  private locale: Locale;
  private utcMode = false;
  private state: any;

  constructor(state, getApi) {
    this.state = state;
    this.locale = state.get('config.locale');
    this.utcMode = state.get('config.utcMode');
    if (this.utcMode) {
      dayjs.extend(utc);
    }
    // @ts-ignore
    dayjs.locale(this.locale, null, true);
  }

  public date(time) {
    const _dayjs = this.utcMode ? dayjs.utc : dayjs;
    return time ? _dayjs(time).locale(this.locale.name) : _dayjs().locale(this.locale.name);
  }

  public recalculateFromTo(time) {
    time = { ...time };
    if (time.from !== 0) {
      time.from = this.date(time.from)
        .startOf('day')
        .valueOf();
    }
    if (time.to !== 0) {
      time.to = this.date(time.to)
        .endOf('day')
        .valueOf();
    }

    let from = Number.MAX_SAFE_INTEGER,
      to = 0;
    const items = this.state.get('config.chart.items');
    if (Object.keys(items).length === 0) {
      return time;
    }
    if (time.from === 0 || time.to === 0) {
      for (const itemId in items) {
        const item = items[itemId];
        if (from > item.time.start) {
          from = item.time.start;
        }
        if (to < item.time.end) {
          to = item.time.end;
        }
      }
      if (time.from === 0) {
        time.from = this.date(from)
          .startOf('day')
          .valueOf();
      }
      if (time.to === 0) {
        time.to = this.date(to)
          .endOf('day')
          .valueOf();
      }
    }
    return time;
  }

  public timeToPixelOffset(miliseconds: number): number {
    return miliseconds / this.state.get('_internal.chart.time.timePerPixel');
  }
}
