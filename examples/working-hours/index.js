import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

const rowsFromDB = [
  {
    id: '1',
    label: 'Row 1',
  },
  {
    id: '2',
    label: 'Row 2',
  },
  {
    id: '3',
    label: 'Row 3',
  },
  {
    id: '4',
    label: 'Row 4',
  },
  {
    id: '5',
    label: 'Row 5',
  },
  {
    id: '6',
    label: 'Row 6',
  },
  {
    id: '7',
    label: 'Row 7',
  },
  {
    id: '8',
    label: 'Row 8',
  },
  {
    id: '9',
    label: 'Row 9',
  },
  {
    id: '10',
    label: 'Row 10',
  },
  {
    id: '11',
    label: 'Row 11',
  },
  {
    id: '12',
    label: 'Row 12',
  },
];

const itemsFromDB = [
  {
    id: '1',
    label: 'Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').add(8, 'hours').valueOf(),
      end: GSTC.api.date('2020-01-01').startOf('day').add(15, 'hours').endOf('hour').valueOf(), // from 08:00:00.000 to 15:59:59.999
    },
  },
  {
    id: '2',
    label: 'Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-03').startOf('day').add(8, 'hours').valueOf(),
      end: GSTC.api.date('2020-01-03').startOf('day').add(15, 'hours').endOf('hour').valueOf(),
    },
  },
  {
    id: '3',
    label: 'Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-05').startOf('day').add(8, 'hours').valueOf(),
      end: GSTC.api.date('2020-01-05').startOf('day').add(15, 'hours').endOf('hour').valueOf(),
    },
  },
];

const columnsFromDB = [
  {
    id: 'id',
    label: 'ID',
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: 'ID',
    },
  },
  {
    id: 'label',
    data: 'label',
    sortable: 'label',
    isHTML: false,
    width: 230,
    header: {
      content: 'Label',
    },
  },
];

/**
 * @type { import('../../dist/gstc').ChartCalendarLevel }
 */
const months = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'day',
    periodIncrement: 1,
    format({ timeStart }) {
      return timeStart.format('YYYY-MM-DD'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
];

/**
 * @type { import('../../dist/gstc').ChartCalendarLevel }
 */
const days = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 8,
    main: true, // we want grid to be divided by this period = 8 hours
    format({ timeStart, timeEnd }) {
      return `${timeStart.format('HH:mm')} - ${timeEnd.format('HH:mm')}`;
    },
  },
];

function onLevelDates({ dates, level, format, time }) {
  if (time.period !== 'hour') return dates;
  if (format.period !== time.period) return dates;
  return dates.filter((date) => {
    // filter out dates that are not working hours (do not start at 08:00)
    return date.leftGlobalDate.hour() === 8;
  });
}

// Configuration object

// Typescript usage:
// import { Config } from 'gantt-schedule-timeline-calendar';
// const config: Config = {...};
/**
 * @type {import('../../dist/gstc').Config}  // or {import('gantt-schedule-timeline-calendar').Config}
 */
const config = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  plugins: [
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing(), // resizing must fo before movement
    ItemMovement({
      events: {
        onMove({ items }) {
          console.log('Items moved:', items.after);
          return items.after;
        },
      },
    }),
  ],
  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows: GSTC.api.fromArray(rowsFromDB),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB),
    calendarLevels: [months, days],
    time: {
      zoom: 16,
      onLevelDates: [onLevelDates],
      from: GSTC.api.date('2020-01-01').add(8, 'hours').valueOf(),
      to: GSTC.api.date('2020-01-20').endOf('day').valueOf(),
    },
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

// for testing
globalThis.state = state;

const element = document.getElementById('gstc');
if (!element) throw new Error('Element not found');

element.addEventListener('gstc-loaded', (ev) => {
  // @ts-ignore
  globalThis.dispatchEvent(new Event('gstc-loaded', ev.target));
});

// Mount the component
const app = (globalThis.gstc = GSTC({
  element,
  state,
}));
