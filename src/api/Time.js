/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import dayjs from 'dayjs';

export default function timeApi(state, getApi) {
  const locale = state.get('config.locale');
  dayjs.locale(locale, null, true);
  return {
    date(time) {
      return time ? dayjs(time).locale(locale.name) : dayjs().locale(locale.name);
    },
    recalculateFromTo(time) {
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
      const items = state.get('config.chart.items');
      if (Object.keys(items).length === 0) {
        return time;
      }
      if (time.from === 0 || time.to === 0) {
        for (let itemId in items) {
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
  };
}
