import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';

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
    label: 'Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-20').endOf('day').valueOf(),
    },
  },
  {
    id: '4',
    label: '🚫 Not selectable id4',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-05').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-07').endOf('day').valueOf(),
    },
  },
  {
    id: '5',
    label: '🚫 Not selectable id5',
    canSelect: false,
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

const doNotSelectThisCells = ['2020-01-10'];
const doNotSelectThisItems = [GSTC.api.GSTCID('4')];

function canSelectItem(item) {
  console.log('canSelect', item, doNotSelectThisItems.includes(item.id), doNotSelectThisItems);
  if (typeof item.canSelect === 'boolean') return item.canSelect;
  return !doNotSelectThisItems.includes(item.id);
}

function preventSelection(selecting) {
  return {
    'chart-timeline-grid-row-cell': selecting['chart-timeline-grid-row-cell'].filter(
      (cell) => !doNotSelectThisCells.includes(cell.time.leftGlobalDate.format('YYYY-MM-DD'))
    ),
    'chart-timeline-items-row-item': selecting['chart-timeline-items-row-item'].filter((item) => canSelectItem(item)),
  };
}

function addCellBackground({ time, row, vido }) {
  const isSelectable = !doNotSelectThisCells.includes(time.leftGlobalDate.format('YYYY-MM-DD'));
  console.log('ceell', time.leftGlobalDate.format('YYYY-MM-DD'), isSelectable);
  return isSelectable
    ? vido.html`<div class="selectable-cell" style="width:100%;height:100%;"></div>`
    : vido.html`<div class="not-selectable-cell" style="width:100%;height:100%;">🚫</div>`;
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
  innerHeight: 100,
  plugins: [
    TimelinePointer({}), // timeline pointer must go first before selection
    Selection({
      events: {
        onStart(lastSelected) {
          // we can clear selection each time we start to prevent shift+select multiple cells
          // gstc.api.plugins.selection.selectCells([]);
          console.log('selecting start');
        },
        onSelecting(selecting, lastSelected) {
          const filtered = preventSelection(selecting);
          console.log('Selecting cells', filtered['chart-timeline-grid-row-cell']);
          console.log('Selecting items', filtered['chart-timeline-items-row-item']);
          return filtered;
        },
        onEnd(selected, lastSelected) {
          const filtered = preventSelection(selected);
          console.log('Selected cells', filtered['chart-timeline-grid-row-cell']);
          console.log('Selected items', filtered['chart-timeline-items-row-item']);
          return filtered;
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
    grid: {
      cell: {
        onCreate: [addCellBackground],
      },
    },
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

document.getElementById('cells')?.addEventListener('change', function (el) {
  // @ts-ignore
  state.update('config.plugin.Selection.cells', el.target.checked);
});
document.getElementById('items')?.addEventListener('change', function (el) {
  // @ts-ignore
  state.update('config.plugin.Selection.items', el.target.checked);
});
document.getElementById('overlay')?.addEventListener('change', function (el) {
  // @ts-ignore
  state.update('config.plugin.Selection.showOverlay', el.target.checked);
});
document.getElementById('multiple')?.addEventListener('change', function (el) {
  // @ts-ignore
  state.update('config.plugin.Selection.multipleSelection', el.target.checked);
});

// for testing
globalThis.state = state;

const element = document.getElementById('gstc');
if (!element) throw new Error('Element not found');

// Mount the component
const app = GSTC({
  element,
  state,
});

document.getElementById('select-items')?.addEventListener('click', function (el) {
  app.api.plugins.selection.selectItems([GSTC.api.GSTCID('3')]);
});
document.getElementById('select-cells')?.addEventListener('click', function (el) {
  const allCells = app.api.getGridCells();
  const cellsForSelect = allCells
    .filter((cell) => cell.time.leftGlobalDate.format('YYYY-MM-DD') === '2020-01-09')
    .map((cell) => cell.id);
  app.api.plugins.selection.selectCells(cellsForSelect);
});
document.getElementById('get-selected')?.addEventListener('click', function (el) {
  const selected = app.api.plugins.selection.getSelected();
  console.log('selected', selected);
});
document.getElementById('clear')?.addEventListener('click', function (el) {
  app.api.plugins.selection.selectCells([]);
  app.api.plugins.selection.selectItems([]);
});

function scrollToCell() {
  app.api.scrollToTime(app.api.time.date('2020-01-10').valueOf(), false);
}
globalThis.scrollToCell = scrollToCell;

document.getElementById('scroll-to-cell')?.addEventListener('click', scrollToCell);

//for testing
globalThis.gstc = app;
