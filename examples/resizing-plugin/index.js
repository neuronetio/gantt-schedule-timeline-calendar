import GSTC from '../../dist/gstc.esm.min.js';
// or when you encounter problems with wasm loader
// import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
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
];

const itemsFromDB = [
  {
    id: '1',
    label: 'Snap to specified time',
    snap: true,
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-02').endOf('day').valueOf(),
    },
  },
  {
    id: '2',
    label: 'Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-02-01').startOf('day').valueOf(),
      end: GSTC.api.date('2020-02-02').endOf('day').valueOf(),
    },
  },
  {
    id: '3',
    label: 'Only 3 days length',
    resizableLength: 3,
    resizablePeriod: 'day',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-17').endOf('day').valueOf(),
    },
  },
  {
    id: '4',
    label: 'Not resizable',
    resizable: false,
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-05').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-07').endOf('day').valueOf(),
    },
  },
  {
    id: '5',
    label: 'From 03 to 09 only',
    resizableFrom: GSTC.api.date('2020-01-03').startOf('day').valueOf(),
    resizableTo: GSTC.api.date('2020-01-09').endOf('day').valueOf(),
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-05').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-07').endOf('day').valueOf(),
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

function isItemResizable(item) {
  if (typeof item.resizable === 'boolean') return item.resizable;
  return true;
}

function limitTime(item, oldItem) {
  if (item.resizableFrom && item.time.start < item.resizableFrom) {
    item.time.start = item.resizableFrom;
  }
  if (item.resizableTo && item.time.end > item.resizableTo) {
    item.time.end = item.resizableTo;
  }
  if (item.resizableLength && item.resizablePeriod) {
    const actualDiff = GSTC.api
      .date(item.time.end)
      .diff(item.time.start, item.resizablePeriod, true);
    if (actualDiff > item.resizableLength) {
      const resizingFromStart = item.time.end === oldItem.time.end;
      if (resizingFromStart) {
        item.time.start = GSTC.api
          .date(item.time.end)
          .subtract(item.resizableLength, item.resizablePeriod) // -1 here because end of day - 3 days -> startOf day = almost 4 days
          .valueOf();
      } else {
        item.time.end = GSTC.api
          .date(item.time.start)
          .add(item.resizableLength, item.resizablePeriod)
          .valueOf();
      }
    }
  }
  return item;
}

function snapToTimeSeparately(item) {
  if (!item.snap) return item;
  const start = GSTC.api.date(item.time.start).startOf('day').add(10, 'hour');
  const end = GSTC.api.date(item.time.end).startOf('day').add(18, 'hour');
  item.time.start = start.valueOf();
  item.time.end = end.valueOf();
  // to change other properties than time we need to update item
  // because resizing-items plugin only works on time property
  state.update(
    `config.chart.items.${item.id}.label`,
    `From ${start.format('YYYY-MM-DD HH:mm')} to ${end.format(
      'YYYY-MM-DD HH:mm'
    )}`
  );
  return item;
}

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig({
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 100,
  plugins: [
    TimelinePointer({}), // timeline pointer must go first before selection and resizing
    Selection({ cells: false }),
    ItemResizing({
      events: {
        onStart({ items }) {
          console.log('Resizing start', items.after);
          return items.after;
        },
        onResize({ items }) {
          const filtered = items.after
            .map((item, index) => {
              if (!isItemResizable(item)) {
                return items.before[index];
              }
              return item;
            })
            .map((item, index) => limitTime(item, items.before[index]))
            .map((item) => snapToTimeSeparately(item));
          return filtered;
        },
        onEnd({ items }) {
          console.log('Resizing done', items.after);
          return items.after;
        },
      },
      snapToTime: {
        start({ startTime }) {
          // reset default period snapping behavior
          // if you want custom snapping for all items out of the box - you can do it here
          // like: return startTime.startOf('day').add(8,'hour');
          return startTime;
        },
        end({ endTime }) {
          // reset default period snapping behavior
          return endTime;
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
  },
});

// for testing
globalThis.state = state;

// Mount the component
const app = GSTC({
  element: document.getElementById('gstc'),
  state,
});

//for testing
globalThis.gstc = app;
