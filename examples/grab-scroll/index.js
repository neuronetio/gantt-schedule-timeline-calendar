import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';
import { Plugin as GrabScroll } from '../../dist/plugins/grab-scroll.esm.min.js';

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
    expander: true,
    header: {
      content: 'Label',
    },
  },
];

const iterations = 100;
const GSTCID = GSTC.api.GSTCID;
const addDays = 30;
const startDate = GSTC.api.date('2020-02-01');
const startTime = startDate.valueOf();
const endDate = GSTC.api.date('2020-03-31').endOf('day');

function generateRows() {
  /**
   * @type {import("../../dist/gstc").Rows}
   */
  const rows = {};
  for (let i = 0; i < iterations; i++) {
    const withParent = i > 0 && i % 2 === 0;
    const id = GSTCID(String(i));
    rows[id] = {
      id,
      label: `John Doe ${i}`,
      parentId: withParent ? GSTCID(String(i - 1)) : undefined,
      expanded: false,
      visible: true,
    };
  }

  rows[GSTCID('11')].label = 'NESTED TREE HERE';
  rows[GSTCID('12')].parentId = GSTCID('11');
  rows[GSTCID('13')].parentId = GSTCID('12');
  rows[GSTCID('14')].parentId = GSTCID('13');
  return rows;
}

function generateItems() {
  /**
   * @type {import("../../dist/gstc").Items}
   */
  const items = {};
  for (let i = 0; i < iterations; i++) {
    let rowId = GSTCID(i.toString());
    let id = GSTCID(i.toString());
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
      time: {
        start: startDayjs.startOf('day').valueOf(),
        end,
      },
      rowId,
    };
  }

  return items;
}

let grabScrollEnabled = true;
let speedMultiplier = 2;
const grabScrollRadio = document.getElementById('grab-scroll');
const multiplierInput = document.getElementById('multiplier');
const pointerModeFieldset = document.getElementById('pointer-mode');

function enableGrabScroll(enabled = true, multiplier = 1) {
  const plugin = state.get('config.plugin');
  if (!plugin.GrabScroll) {
    return;
  }
  state.update('config.plugin.GrabScroll', (options) => {
    options.enabled = enabled;
    options.multiplier = {
      x: multiplier,
      y: multiplier,
    };
    return options;
  });
  if (plugin.Selection) {
    state.update('config.plugin.Selection.enabled', !enabled);
  }
  if (plugin.ItemResizing) {
    state.update('config.plugin.ItemResizing.enabled', !enabled);
  }
  if (plugin.ItemMovement) {
    state.update('config.plugin.ItemMovement.enabled', !enabled);
  }
}

function updateOptions() {
  // @ts-ignore
  grabScrollEnabled = grabScrollRadio.checked;
  // @ts-ignore
  speedMultiplier = Number(multiplierInput.value);
  enableGrabScroll(grabScrollEnabled, speedMultiplier);
}

if (pointerModeFieldset) {
  pointerModeFieldset.addEventListener('change', (ev) => {
    updateOptions();
  });
}
if (multiplierInput) {
  multiplierInput.addEventListener('input', (ev) => {
    updateOptions();
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
    TimelinePointer(),
    Selection({
      enabled: !grabScrollEnabled,
    }),
    ItemResizing({
      enabled: !grabScrollEnabled,
    }),
    ItemMovement({
      enabled: !grabScrollEnabled,
    }),
    GrabScroll({
      enabled: grabScrollEnabled,
      multiplier: {
        x: 2,
        y: 2,
      },
    }),
  ],
  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows: generateRows(),
  },
  chart: {
    items: generateItems(),
    time: {
      from: startDate.valueOf(),
      to: endDate.valueOf(),
    },
  },
  scroll: {
    horizontal: {
      byPixels: false,
      precise: true,
    },
    vertical: {
      byPixels: false,
      precise: true,
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
