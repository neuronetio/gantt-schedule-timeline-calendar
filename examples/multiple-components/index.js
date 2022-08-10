import GSTC from '../../dist/gstc.wasm.esm.min.js';

const rowsFromDB1 = [
  {
    id: '1',
    label: '(1) Row 1',
  },
  {
    id: '2',
    label: '(1) Row 2',
  },
];

const itemsFromDB1 = [
  {
    id: '1',
    label: '(1) Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '2',
    label: '(1) Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-02-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-02-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '3',
    label: '(1) Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-20').endOf('day').add(12, 'hour').valueOf(),
    },
  },
];

const columnsFromDB1 = [
  {
    id: 'id',
    label: '(1) ID',
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: '(1) ID',
    },
  },
  {
    id: 'label',
    data: 'label',
    sortable: 'label',
    isHTML: false,
    width: 230,
    header: {
      content: '(1) Label',
    },
  },
];

// Configuration object
const config1 = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB1),
    },
    rows: GSTC.api.fromArray(rowsFromDB1),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB1),
  },
};

// Generate GSTC state from configuration object
const state1 = GSTC.api.stateFromConfig(config1);

// for testing
globalThis.state1 = state1;

// Mount the component
const app1 = GSTC({
  element: document.getElementById('gstc1'),
  state: state1,
});

//for testing
globalThis.gstc1 = app1;

// ------------ SECOND ONE ----------------

const rowsFromDB2 = [
  {
    id: '1',
    label: '(2) Row 1',
  },
  {
    id: '2',
    label: '(2) Row 2',
  },
];

const itemsFromDB2 = [
  {
    id: '1',
    label: '(2) Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '2',
    label: '(2) Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-02-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-02-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '3',
    label: '(2) Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-20').endOf('day').add(12, 'hour').valueOf(),
    },
  },
];

const columnsFromDB2 = [
  {
    id: 'id',
    label: '(2) ID',
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: '(2) ID',
    },
  },
  {
    id: 'label',
    data: 'label',
    sortable: 'label',
    isHTML: false,
    width: 230,
    header: {
      content: '(2) Label',
    },
  },
];

// Configuration object
const config2 = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB2),
    },
    rows: GSTC.api.fromArray(rowsFromDB2),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB2),
  },
};

// Generate GSTC state from configuration object
const state2 = GSTC.api.stateFromConfig(config2);

// for testing
globalThis.state2 = state2;

// Mount the component
const app2 = GSTC({
  element: document.getElementById('gstc2'),
  state: state2,
});

//for testing
globalThis.gstc2 = app2;
