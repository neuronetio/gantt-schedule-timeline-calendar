import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as CalendarScroll } from '../../dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as DependencyLines } from '../../dist/plugins/dependency-lines.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';

const GSTCID = GSTC.api.GSTCID;

const rowsFromDB = [
  {
    id: 'R01',
    label: 'R1',
    expanded: true,
  },
  {
    id: 'R01_01',
    label: 'R1-1',
    parentId: 'R01',
    expanded: true,
  },
  {
    id: 'R01_01_01',
    label: 'R1-1-1',
    parentId: 'R01_01',
    expanded: true,
  },
  {
    id: 'R01_01_01_1549',
    label: 'R1-1-1-1',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_01_1552',
    label: 'R1-1-1-1',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_01_1557',
    label: 'R1-1-1-1',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_01_1560',
    label: 'R1-1-1-1',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_02_1550',
    label: 'R1-1-1-2',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_02_1555',
    label: 'R1-1-1-2',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_02_1558',
    label: 'R1-1-1-2',
    parentId: 'R01_01_01',
    expanded: true,
  },
  {
    id: 'R01_01_02_1561',
    label: 'R1-1-1-2',
    parentId: 'R01_01_01',
    expanded: true,
  },
];

const itemsFromDB = [
  {
    id: 'T1',
    rowId: 'R01_01_01_1549',
    label: 'T1',
    time: {
      start: GSTC.api.date('2022-06-23 08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23 13:30:00').valueOf(),
    },
    dependant: [GSTCID('T2')],
  },
  {
    id: 'T2',
    rowId: 'R01_01_01_1549',
    label: 'T2',
    time: {
      start: GSTC.api.date('2022-06-23T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T21:30:00').valueOf(),
    },
    dependant: [GSTCID('T9')],
  },
  {
    id: 'T3',
    rowId: 'R01_01_01_1552',
    label: 'T3',
    time: {
      start: GSTC.api.date('2022-06-23T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T13:30:00').valueOf(),
    },
    dependant: [GSTCID('T4')],
  },
  {
    id: 'T4',
    rowId: 'R01_01_01_1552',
    label: 'T4',
    time: {
      start: GSTC.api.date('2022-06-23T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T21:30:00').valueOf(),
    },
    dependant: [GSTCID('T12')],
  },
  {
    id: 'T5',
    rowId: 'R01_01_01_1557',
    label: 'T5',
    time: {
      start: GSTC.api.date('2022-06-23T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T13:30:00').valueOf(),
    },
    dependant: [GSTCID('T6')],
  },
  {
    id: 'T6',
    rowId: 'R01_01_01_1557',
    label: 'T6',
    time: {
      start: GSTC.api.date('2022-06-23T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T21:30:00').valueOf(),
    },
    dependant: [GSTCID('T15')],
  },
  {
    id: 'T7',
    rowId: 'R01_01_01_1560',
    label: 'T7',
    time: {
      start: GSTC.api.date('2022-06-23T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T13:30:00').valueOf(),
    },
    dependant: [GSTCID('T8')],
  },
  {
    id: 'T8',
    rowId: 'R01_01_01_1560',
    label: 'T8',
    time: {
      start: GSTC.api.date('2022-06-23T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-23T21:30:00').valueOf(),
    },
    dependant: [GSTCID('T18')],
  },
  {
    id: 'T9',
    rowId: 'R01_01_02_1550',
    label: 'T9',
    time: {
      start: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-24T13:30:00').valueOf(),
    },
    dependant: [GSTCID('T10')],
  },
  {
    id: 'T10',
    rowId: 'R01_01_02_1550',
    label: 'T10',
    time: {
      start: GSTC.api.date('2022-06-24T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-25T01:30:00').valueOf(),
    },
    dependant: [GSTCID('T11')],
  },
  {
    id: 'T11',
    rowId: 'R01_01_02_1550',
    label: 'T11',
    time: {
      start: GSTC.api.date('2022-06-24T13:30:00').valueOf(),
      // start: GSTC.api.date('2022-06-24T13:30:01').valueOf(),
      end: GSTC.api.date('2022-06-24T21:30:00').valueOf(),
    },
    dependant: [],
  },
  {
    id: 'T12',
    rowId: 'R01_01_02_1555',
    label: 'T12',
    time: {
      start: GSTC.api.date('2022-06-23T13:30:00').valueOf(),
      end: GSTC.api.date('2022-06-25T08:30:00').valueOf(),
    },
    dependant: [GSTCID('T13')],
  },
  {
    id: 'T13',
    rowId: 'R01_01_02_1555',
    label: 'T13',
    time: {
      start: GSTC.api.date('2022-06-25T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-25T16:30:00').valueOf(),
    },
    dependant: [GSTCID('T14')],
  },
  {
    id: 'T14',
    rowId: 'R01_01_02_1555',
    label: 'T14',
    time: {
      start: GSTC.api.date('2022-06-25T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-26T01:30:00').valueOf(),
    },
    dependant: [],
  },
  {
    id: 'T15',
    rowId: 'R01_01_02_1558',
    label: 'T15',
    time: {
      start: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
    },
    dependant: [GSTCID('T16')],
  },
  {
    id: 'T16',
    rowId: 'R01_01_02_1558',
    label: 'T16',
    time: {
      start: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-24T16:30:00').valueOf(),
    },
    dependant: [GSTCID('T17')],
  },
  {
    id: 'T17',
    rowId: 'R01_01_02_1558',
    label: 'T17',
    time: {
      start: GSTC.api.date('2022-06-24T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-25T01:30:00').valueOf(),
    },
    dependant: [],
  },
  {
    id: 'T18',
    rowId: 'R01_01_02_1561',
    label: 'T18',
    time: {
      start: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
    },
    dependant: [GSTCID('T19')],
  },
  {
    id: 'T19',
    rowId: 'R01_01_02_1561',
    label: 'T19',
    time: {
      start: GSTC.api.date('2022-06-24T08:30:00').valueOf(),
      end: GSTC.api.date('2022-06-24T16:30:00').valueOf(),
    },
    dependant: [GSTCID('T20')],
  },
  {
    id: 'T20',
    rowId: 'R01_01_02_1561',
    label: 'T20',
    time: {
      start: GSTC.api.date('2022-06-24T17:30:00').valueOf(),
      end: GSTC.api.date('2022-06-25T01:30:00').valueOf(),
    },
    dependant: [],
  },
];

const columnsFromDB = [
  {
    id: 'id',
    data: 'id',
    sortable: 'id',
    width: 200,
    header: {
      content: 'ID',
    },
  },
  {
    id: 'label',
    data: 'label',
    sortable: 'label',
    expander: true,
    isHTML: false,
    width: 200,
    header: {
      content: 'Label',
    },
  },
];

// Configuration object

// Typescript usage:
// import { Config } from 'gantt-schedule-timeline-calendar';
// const config: Config = {...};
/**
 * @type {import('../../dist/gstc').Config}  // or {import('gantt-schedule-timeline-calendar').Config}
 */
const config = {
  // for trial key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 800,
  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows: GSTC.api.fromArray(rowsFromDB),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB),
    time: {
      zoom: 18.5,
    },
  },
  plugins: [TimelinePointer(), Selection(), CalendarScroll(), DependencyLines()],
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
