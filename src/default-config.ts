export const actionNames = [
  '',
  'list',
  'list-column',
  'list-column-header',
  'list-expander',
  'list-expander-toggle',
  'list-column-header-resizer',
  'list-column-row',
  'chart',
  'chart-calendar',
  'chart-gantt',
  'chart-gantt-grid',
  'chart-gantt-grid-row',
  'chart-gantt-items',
  'chart-gantt-items-row',
  'chart-gantt-items-row-item',
  'chart-calendar-date',
  'chart-gantt-grid-column',
  'chart-gantt-grid-block'
];

function generateEmptyActions() {
  const actions = {};
  actionNames.forEach(name => (actions[name] = []));
  return actions;
}

// default configuration
const defaultConfig = {
  height: 740,
  headerHeight: 86,
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
      data: {}
    },
    expander: {
      padding: 20,
      size: 20,
      icons: {
        open:
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
        closed:
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'
      }
    }
  },
  scroll: {
    top: 0,
    left: 0,
    xMultiplier: 1.5,
    yMultiplier: 1,
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
      dates: []
    },
    calendar: {
      vertical: {
        smallFormat: 'YYYY-MM-DD'
      }
    },
    grid: {},
    items: {}
  },
  classNames: {},
  actions: generateEmptyActions(),
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
  }
};

export default defaultConfig;
