import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

import detectAdBlock from './prebid-ads.js';
detectAdBlock().then((enabled) => {
  if (globalThis.gstc && enabled) {
    const lithtml = globalThis.gstc.lithtml;
    const warning = lithtml.html`<div style="color:red;font-weight:bold;margin:10px;">You should disable the ad-blocking extension on this page as it can significantly slow down the DOM updates.</div>`;
    const warningEl = document.getElementById('warning');
    if (warningEl) lithtml.render(warning, warningEl);
  }
});

let iterations = 1000;

let gstc, state;

const fromDate = GSTC.api.date().startOf('month');
let toDate = fromDate.add(30, 'day');

/**
 * @type {import("../../dist/gstc").Rows}
 */
let rows = {};
function generateNewRows() {
  rows = {};
  for (let i = 0; i < iterations; i++) {
    const id = GSTC.api.GSTCID(String(i));
    rows[id] = {
      id,
      label: `Row ${i + 1}`,
    };
  }
  return rows;
}

let dateIncrement = 0;

// Typescript usage:
// import { Items } from 'gantt-schedule-timeline-calendar';
// let items: Items = {};
/**
 * @type {import("../../dist/gstc").Items} // or {import("gantt-schedule-timeline-calendar").Items}
 */
let items = {};
function generateNewItems() {
  let rowsIds = Object.keys(rows);
  items = {};
  for (let i = 0, len = rowsIds.length; i < len; i++) {
    let rowId = rowsIds[i /* % 2 === 0 ? i : i + 1*/];
    let id = GSTC.api.GSTCID(String(i));
    if (dateIncrement >= 30) dateIncrement = 0;
    const startTime = fromDate.add(dateIncrement, 'day').startOf('day').valueOf();
    const endTime = fromDate.add(dateIncrement, 'day').endOf('day').valueOf();
    items[id] = {
      id,
      rowId,
      label: `Item ${i + 1}`,
      time: {
        start: startTime,
        end: endTime,
      },
    };
    dateIncrement++;
  }
  return items;
}

function generateNewItemsMulti() {
  let rowsIds = Object.keys(rows);
  const days = 180;
  items = {};
  for (let i = 0, len = rowsIds.length; i < len; i++) {
    let rowId = rowsIds[i /* % 2 === 0 ? i : i + 1*/];
    let id = GSTC.api.GSTCID(String(i));
    let dateIncrement = 0;
    for (let j = 0; j < days; j++) {
      const startTime = fromDate.add(dateIncrement, 'day').startOf('day').valueOf();
      const endTime = fromDate.add(dateIncrement, 'day').endOf('day').valueOf();
      const localId = GSTC.api.GSTCID(String(i) + '-' + String(j));
      items[localId] = {
        id: localId,
        rowId,
        label: `Item ${i + 1} - ${j + 1}`,
        time: {
          start: startTime,
          end: endTime,
        },
      };
      dateIncrement++;
    }
  }
  return items;
}

const columns = {
  data: {
    [GSTC.api.GSTCID('id')]: {
      id: GSTC.api.GSTCID('id'),
      data: ({ row }) => GSTC.api.sourceID(row.id),
      width: 80,
      sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
      header: {
        content: 'ID',
      },
      resizer: false,
    },
    [GSTC.api.GSTCID('label')]: {
      id: GSTC.api.GSTCID('label'),
      data: 'label',
      sortable: 'label',
      expander: false,
      isHTML: false,
      width: 230,
      header: {
        content: 'Label',
      },
    },
  },
};

// Typescript usage:
// import { Config } from 'gantt-schedule-timeline-calendar';
// const config: Config = {...};
/**
 * @type {import("../../dist/gstc").Config} // or {import("gantt-schedule-timeline-calendar").Config}
 */
const config = {
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  autoInnerHeight: true,
  innerHeight: 500,
  plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
  list: {
    rows: {},
    columns,
  },
  chart: {
    item: {
      // overlap: true, // speed improvement - no overlap check
    },
    items: {},
    time: {
      zoom: 19.4,
    },
  },
  scroll: {
    // speed improvement
    horizontal: {
      precise: false,
      byPixels: false,
    },
    vertical: {
      precise: false,
      byPixels: false,
    },
  },
};

state = GSTC.api.stateFromConfig(config);
const element = document.getElementById('gstc');
if (!element) throw new Error('Element not found');
gstc = GSTC({
  element,
  state,
});

const genEl = document.getElementById('gen');
if (!genEl) throw new Error('Element not found');
const genScreenStyle = genEl.style;

function showLoadingScreen() {
  genScreenStyle.display = 'block';
}

function hideLoadingScreen() {
  genScreenStyle.display = 'none';
}

function generate(multiRow = false) {
  generateNewRows();
  if (!multiRow) {
    generateNewItems();
  } else {
    generateNewItemsMulti();
  }
}

// state.update('config', (config) => {
//   config.list.rows = data.rows;
//   config.chart.items = data.items;
//   return config;
// });

function update(count, multiRow = false) {
  showLoadingScreen();
  setTimeout(() => {
    iterations = count;
    generate(multiRow);
    state.update('config', (config) => {
      config.list.rows = rows;
      config.chart.items = items;
      // config.chart.time.from = fromDate.valueOf();
      // config.chart.time.to = toDate.valueOf();
      return config;
    });
    hideLoadingScreen();
  }, 0);
}

document.getElementById('100')?.addEventListener('click', () => {
  update(1000, true);
});

document.getElementById('1k')?.addEventListener('click', () => {
  update(1000);
});

document.getElementById('5k')?.addEventListener('click', () => {
  update(5000);
});

document.getElementById('10k')?.addEventListener('click', () => {
  update(10000);
});

document.getElementById('20k')?.addEventListener('click', () => {
  update(20000);
});

document.getElementById('30k')?.addEventListener('click', () => {
  update(30000);
});

document.getElementById('50k')?.addEventListener('click', () => {
  update(50000);
});
/*
document.getElementById('100k').addEventListener('click', () => {
  update(100000);
});
*/
//@ts-ignore
globalThis.state = state;
//@ts-ignore
globalThis.gstc = gstc;
