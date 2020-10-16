import GSTC from '../../dist/gstc.esm.min.js';
// @ts-ignore
GSTC.api.dayjs.extend(window.dayjs_plugin_weekOfYear);
//@ts-ignore
GSTC.api.dayjs.extend(window.dayjs_plugin_advancedFormat);

const rowsFromDB = [
  {
    id: '1',
    label: 'Row 1',
  },
  {
    id: '2',
    label: 'Row 2',
  },
];

const itemsFromDB = [
  {
    id: '1',
    label: 'Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01 00:00:00').valueOf(),
      end: GSTC.api.date('2020-01-01 00:00:00').endOf('hour').valueOf(),
    },
  },
  {
    id: '2',
    label: 'Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01 08:00:00').startOf('hour').valueOf(),
      end: GSTC.api.date('2020-01-01 10:00:00').endOf('hour').valueOf(),
    },
  },
];

const columnsFromDB = [
  {
    id: 'id',
    label: 'ID',
    data: ({ row }) => Number(GSTC.api.sourceID(row.id)), // show original id
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
    width: 300,
    header: {
      content: 'Label',
    },
  },
];

const hours = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 1,
    format({ timeStart }) {
      return timeStart.format('HH:mm DD MMMM YYYY'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
];

const minutes = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'minute',
    periodIncrement: 15,
    main: true,
    format({ timeStart, vido }) {
      return vido.html`<div style="text-align:center;">${timeStart.format('HH:mm')}</div>`; // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
];

// Configuration object
const config = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows: GSTC.api.fromArray(rowsFromDB),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB),
    calendarLevels: [hours, minutes],
    time: {
      zoom: 13,
      from: GSTC.api.date('2020-01-01').startOf('month').valueOf(),
      to: GSTC.api.date('2020-01-01').endOf('month').valueOf(),
    },
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

// for testing
// @ts-ignore
window.state = state;

// Mount the component
const app = GSTC({
  element: document.getElementById('gstc'),
  state,
});

//for testing
// @ts-ignore
window.gstc = app;
