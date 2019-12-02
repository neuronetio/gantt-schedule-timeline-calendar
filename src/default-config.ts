/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import Main from './components/Main';
import List from './components/List/List';
import ListColumn from './components/List/ListColumn';
import ListColumnHeader from './components/List/ListColumnHeader';
import ListColumnHeaderResizer from './components/List/ListColumnHeaderResizer';
import ListColumnRow from './components/List/ListColumnRow';
import ListColumnRowExpander from './components/List/ListColumnRowExpander';
import ListColumnRowExpanderToggle from './components/List/ListColumnRowExpanderToggle';
import ListToggle from './components/List/ListToggle';
import Chart from './components/Chart/Chart';
import ChartCalendar from './components/Chart/Calendar/ChartCalendar';
import ChartCalendarDate from './components/Chart/Calendar/ChartCalendarDate';
import ChartTimeline from './components/Chart/Timeline/ChartTimeline';
import ChartTimelineGrid from './components/Chart/Timeline/ChartTimelineGrid';
import ChartTimelineGridRow from './components/Chart/Timeline/ChartTimelineGridRow';
import ChartTimelineGridRowBlock from './components/Chart/Timeline/ChartTimelineGridRowBlock';
import ChartTimelineItems from './components/Chart/Timeline/ChartTimelineItems';
import ChartTimelineItemsRow from './components/Chart/Timeline/ChartTimelineItemsRow';
import ChartTimelineItemsRowItem from './components/Chart/Timeline/ChartTimelineItemsRowItem';

export const actionNames = [
  '',
  'list',
  'list-column',
  'list-column-header',
  'list-column-header-resizer',
  'list-column-header-resizer-dots',
  'list-column-row',
  'list-column-row-expander',
  'list-column-row-expander-toggle',
  'list-toggle',
  'chart',
  'chart-calendar',
  'chart-calendar-date',
  'chart-timeline',
  'chart-timeline-grid',
  'chart-timeline-grid-row',
  'chart-timeline-grid-row-block',
  'chart-timeline-items',
  'chart-timeline-items-row',
  'chart-timeline-items-row-item'
];

function generateEmptyActions() {
  const actions = {};
  actionNames.forEach(name => (actions[name] = []));
  return actions;
}

// default configuration
function defaultConfig() {
  const actions = generateEmptyActions();
  return {
    plugins: [],
    plugin: {},
    height: 740,
    headerHeight: 86,
    components: {
      Main,
      List,
      ListColumn,
      ListColumnHeader,
      ListColumnHeaderResizer,
      ListColumnRow,
      ListColumnRowExpander,
      ListColumnRowExpanderToggle,
      ListToggle,
      Chart,
      ChartCalendar,
      ChartCalendarDate,
      ChartTimeline,
      ChartTimelineGrid,
      ChartTimelineGridRow,
      ChartTimelineGridRowBlock,
      ChartTimelineItems,
      ChartTimelineItemsRow,
      ChartTimelineItemsRowItem
    },
    wrappers: {
      Main(input) {
        return input;
      },
      List(input) {
        return input;
      },
      ListColumn(input) {
        return input;
      },
      ListColumnHeader(input) {
        return input;
      },
      ListColumnHeaderResizer(input) {
        return input;
      },
      ListColumnRow(input) {
        return input;
      },
      ListColumnRowExpander(input) {
        return input;
      },
      ListColumnRowExpanderToggle(input) {
        return input;
      },
      ListToggle(input) {
        return input;
      },
      Chart(input) {
        return input;
      },
      ChartCalendar(input) {
        return input;
      },
      ChartCalendarDate(input) {
        return input;
      },
      ChartTimeline(input) {
        return input;
      },
      ChartTimelineGrid(input) {
        return input;
      },
      ChartTimelineGridRow(input) {
        return input;
      },
      ChartTimelineGridRowBlock(input) {
        return input;
      },
      ChartTimelineItems(input) {
        return input;
      },
      ChartTimelineItemsRow(input) {
        return input;
      },
      ChartTimelineItemsRowItem(input) {
        return input;
      }
    },
    list: {
      rows: {},
      rowHeight: 40,
      columns: {
        percent: 100,
        resizer: {
          width: 10,
          inRealTime: true,
          dots: 6
        },
        minWidth: 50,
        data: {}
      },
      expander: {
        padding: 18,
        size: 20,
        icon: {
          width: 16,
          height: 16
        },
        icons: {
          child:
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><ellipse ry="4" rx="4" id="svg_1" cy="12" cx="12" fill="#000000B0"/></svg>',
          open:
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
          closed:
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'
        }
      },
      toggle: {
        display: true,
        icons: {
          open: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path stroke="null" d="m16.406954,16.012672l4.00393,-4.012673l-4.00393,-4.012673l1.232651,-1.232651l5.245324,5.245324l-5.245324,5.245324l-1.232651,-1.232651z"/><path stroke="null" d="m-0.343497,12.97734zm1.620144,0l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,3.909362l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,-9.773404l0,1.95468l11.341011,0l0,-1.95468l-11.341011,0z"/></svg>`,
          close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(-180 4.392796516418457,12) " stroke="null" d="m1.153809,16.012672l4.00393,-4.012673l-4.00393,-4.012673l1.232651,-1.232651l5.245324,5.245324l-5.245324,5.245324l-1.232651,-1.232651z"/><path stroke="null" d="m9.773297,12.97734zm1.620144,0l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,3.909362l11.341011,0l0,-1.954681l-11.341011,0l0,1.954681zm0,-9.773404l0,1.95468l11.341011,0l0,-1.95468l-11.341011,0z"/></svg>`
        }
      }
    },
    scroll: {
      top: 0,
      left: 0,
      xMultiplier: 3,
      yMultiplier: 3,
      percent: {
        top: 0,
        left: 0
      }
    },
    chart: {
      time: {
        from: 0,
        to: 0,
        zoom: 21,
        period: 'day',
        dates: {},
        maxWidth: {}
      },
      calendar: {
        vertical: {
          smallFormat: 'YYYY-MM-DD'
        }
      },
      grid: {
        block: {
          onCreate: []
        }
      },
      items: {},
      spacing: 1
    },
    classNames: {},
    actions,
    locale: {
      name: 'en',
      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
      weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
      monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
      weekStart: 1,
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
      },
      ordinal: n => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
      }
    },
    utcMode: false
  };
}

export default defaultConfig;
