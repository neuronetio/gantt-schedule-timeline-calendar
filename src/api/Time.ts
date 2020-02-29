/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0
 */

import dayjs, { OpUnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Locale } from '../types';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);

export default class TimeApi {
  private locale: Locale;
  private utcMode = false;
  private state: any;
  private timeCache = {};

  constructor(state) {
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

  public recalculateFromTo(time: { from: number; to: number }, period: OpUnitType = 'day') {
    time = { ...time };
    time.from = +time.from;
    time.to = +time.to;
    if (time.from !== 0) {
      const cacheKey = 'from-' + period + '-' + time.from;
      if (typeof this.timeCache[cacheKey] !== 'undefined') {
        time.from = this.timeCache[cacheKey];
      } else {
        time.from = this.date(time.from)
          .startOf(period)
          .valueOf();
        this.timeCache[cacheKey] = time.from;
      }
    }
    if (time.to !== 0) {
      const cacheKey = 'to-' + period + '-' + time.to;
      if (typeof this.timeCache[cacheKey] !== 'undefined') {
        time.to = this.timeCache[cacheKey];
      } else {
        time.to = this.date(time.to)
          .endOf(period)
          .valueOf();
        this.timeCache[cacheKey] = time.to;
      }
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
        const cacheKey = 'from-' + period + '-0';
        if (typeof this.timeCache[cacheKey] !== 'undefined') {
          time.from = this.timeCache[cacheKey];
        } else {
          time.from = this.date(from)
            .startOf(period)
            .valueOf();
          this.timeCache[cacheKey] = time.from;
        }
      }
      if (time.to === 0) {
        const cacheKey = 'to-' + period + '-0';
        if (typeof this.timeCache[cacheKey] !== 'undefined') {
          time.to = this.timeCache[cacheKey];
        } else {
          time.to = this.date(to)
            .endOf(period)
            .valueOf();
          this.timeCache[cacheKey] = time.to;
        }
      }
    }
    return time;
  }

  public timeToPixelOffset(miliseconds: number): number {
    const timePerPixel = this.state.get('_internal.chart.time.timePerPixel') || 1;
    return miliseconds / timePerPixel;
  }

  public globalTimeToViewPixelOffset(miliseconds: number, withCompensation = false): number {
    const time = this.state.get('_internal.chart.time');
    let xCompensation = this.state.get('config.scroll.compensation.x') || 0;
    const viewPixelOffset = (miliseconds - time.leftGlobal) / time.timePerPixel;
    if (withCompensation) return viewPixelOffset + xCompensation;
    return viewPixelOffset;
  }
}
