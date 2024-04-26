import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

const iterations = 100;

const startDate = GSTC.api.date().subtract(5, 'month').valueOf();

let gstc, state;

let lastItemId = 0;
let lastRowId = 0;

function generateNewItems() {
  let rowsIds = [];
  if (gstc) {
    const rows = gstc.api.getAllRows();
    rowsIds = Object.keys(rows);
  } else {
    for (let i = 0; i < iterations; i++) {
      rowsIds.push(GSTC.api.GSTCID(String(i)));
    }
  }

  /**
   * @type {import("../../dist/gstc").Items}
   */
  const items = {};
  for (let i = 0, len = rowsIds.length; i < len; i++) {
    let rowId = rowsIds[i];
    let id = GSTC.api.GSTCID(String(lastItemId++));
    let startDayjs = GSTC.api
      .date(startDate)
      .startOf('day')
      .add(Math.floor(Math.random() * 365 * 2), 'day');
    items[id] = {
      id,
      label: 'item id ' + GSTC.api.sourceID(id),
      progress: Math.round(Math.random() * 100),
      time: {
        start: startDayjs.startOf('day').valueOf(),
        end: startDayjs
          .clone()
          .add(Math.floor(Math.random() * 2) + 4, 'day')
          .endOf('day')
          .valueOf(),
      },
      rowId,
    };
  }
  return items;
}

function generateNewItem() {
  let rowId = GSTC.api.GSTCID(String(lastRowId - 1));
  let id = GSTC.api.GSTCID(String(lastItemId++));
  let startDayjs = GSTC.api
    .date(startDate)
    .startOf('day')
    .add(Math.floor(Math.random() * 365 * 2), 'day');
  return {
    id,
    label: 'item id ' + GSTC.api.sourceID(id),
    progress: Math.round(Math.random() * 100),
    time: {
      start: startDayjs.startOf('day').valueOf(),
      end: startDayjs
        .clone()
        .add(Math.floor(Math.random() * 20) + 4, 'day')
        .endOf('day')
        .valueOf(),
    },
    rowId,
  };
}

function generateNewRows() {
  /**
   * @type {import("../../dist/gstc").Rows}
   */
  const rows = {};
  for (let i = 0; i < iterations; i++) {
    const id = GSTC.api.GSTCID(String(lastRowId++));
    rows[id] = {
      id,
      label: `Row ${lastRowId - 1}`,
      expanded: false,
    };
  }
  return rows;
}

function generateNewRow() {
  return {
    id: GSTC.api.GSTCID(String(lastRowId++)),
    label: `Row ${lastRowId}`,
  };
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
      expander: true,
      isHTML: false,
      width: 230,
      header: {
        content: 'Label',
      },
    },
  },
};

/**
 * @type {import("../../dist/gstc").Config}
 */
const config = {
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
  list: {
    rows: generateNewRows(),
    columns,
  },
  chart: {
    items: generateNewItems(),
  },
  scroll: {
    vertical: { precise: false },
  },
};

state = GSTC.api.stateFromConfig(config);
const element = document.getElementById('gstc');

element.addEventListener('gstc-loaded', () => {
  gstc.api.scrollToTime(gstc.api.time.date().valueOf()); // eslint-disable-line
});

gstc = GSTC({
  element,
  state,
});

function setNewItems() {
  state.update('config.chart.items', () => {
    return generateNewItems();
  });
}
globalThis.setNewItems = setNewItems;

function addNewItem() {
  const item = generateNewItem();
  console.log('new item', item);
  state.update(`config.chart.items.${item.id}`, item);
}
globalThis.addNewItem = addNewItem;

function setNewRows() {
  // you cannot create new rows if existing items are assigned to current ones
  // first of all you need to clear items
  state.update('config.chart.items', {});
  state.update('config.list.rows', () => {
    return generateNewRows();
  });
  // you can also update whole config like state.update('config',(config)=>{ config.list.rows = newRows; config.chart.items=newItems; return config; })
}

globalThis.setNewRows = setNewRows;

function addNewRow() {
  const row = generateNewRow();
  state.update(`config.list.rows.${row.id}`, row);
}

globalThis.addNewRow = addNewRow;

document.getElementById('add-items').addEventListener('click', setNewItems);
document.getElementById('add-item').addEventListener('click', addNewItem);
document.getElementById('add-rows').addEventListener('click', setNewRows);
document.getElementById('add-row').addEventListener('click', addNewRow);

//@ts-ignore
globalThis.state = state;
//@ts-ignore
globalThis.gstc = gstc;
