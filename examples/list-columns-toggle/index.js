import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

const GSTCID = GSTC.api.GSTCID;
const iterations = 50;
const addDays = 30;

const rows = {};
for (let i = 0; i < iterations; i++) {
  const id = GSTCID(String(i));
  rows[id] = {
    id,
    name: `John ${i}`,
    surname: `Doe ${i}`,
    progress: Math.floor(Math.random() * 100),
  };
}

const colors = ['#E74C3C', '#DA3C78', '#7E349D', '#0077C0', '#07ABA0', '#0EAC51', '#F1892D'];
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const startDate = GSTC.api.date('2020-02-01');
const startTime = startDate.valueOf();
const endDate = GSTC.api.date('2020-03-31').endOf('day');

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId = GSTCID(i);
  let id = GSTCID(i);
  let startDayjs = GSTC.api
    .date(startTime)
    .startOf('day')
    .add(Math.floor(Math.random() * addDays), 'day');
  let end = startDayjs
    .clone()
    .add(Math.floor(Math.random() * 20) + 4, 'day')
    .endOf('day')
    .valueOf();
  if (end > endDate.valueOf()) end = endDate.valueOf();
  items[id] = {
    id,
    label: `John Doe ${i}`,
    progress: Math.round(Math.random() * 100),
    style: { background: getRandomColor() },
    time: {
      start: startDayjs.startOf('day').valueOf(),
      end,
    },
    rowId,
  };
}

const columnsFromDB = [
  {
    id: 'id',
    label: 'ID',
    hidden: false,
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: 'ID',
    },
  },
  {
    id: 'name',
    data: 'name',
    sortable: 'name',
    width: 230,
    hidden: false,
    header: {
      content: 'Name',
    },
  },
  {
    id: 'surname',
    data: 'surname',
    sortable: 'surname',
    width: 230,
    hidden: false,
    header: {
      content: 'Surname',
    },
  },
  {
    id: 'progress',
    data: 'progress',
    sortable: 'progress',
    hidden: false,
    width: 50,
    header: {
      content: '%',
    },
  },
];

document.getElementById('id').addEventListener('change', (ev) => {
  state.update(`config.list.columns.data.gstcid-id.hidden`, !ev.target.checked);
});

document.getElementById('name').addEventListener('change', (ev) => {
  state.update(`config.list.columns.data.gstcid-name.hidden`, !ev.target.checked);
});

document.getElementById('surname').addEventListener('change', (ev) => {
  state.update(`config.list.columns.data.gstcid-surname.hidden`, !ev.target.checked);
});

document.getElementById('progress').addEventListener('change', (ev) => {
  state.update(`config.list.columns.data.gstcid-progress.hidden`, !ev.target.checked);
});

// Configuration object
const config = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

  plugins: [
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing(), // resizing must go before movement
    ItemMovement(),
  ],
  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows,
    toggle: {
      display: false,
    },
  },
  chart: {
    items,
  },
  scroll: {
    horizontal: {
      precise: true,
    },
    vertical: {
      precise: true,
    },
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

// for testing
globalThis.state = state;

// Mount the component
const app = GSTC({
  element: document.getElementById('gstc'),
  state,
});

//for testing
globalThis.gstc = app;
