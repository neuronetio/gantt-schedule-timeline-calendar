import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

let iterations = 500;

let gstc, state;

const fromDate = GSTC.api.date().startOf('month');

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

/**
 * @type {import("../../dist/gstc").Items}
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
    const endTime = fromDate.add(dateIncrement, 'day').add(1, 'day').endOf('day').valueOf();
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

/**
 * @type {import("../../dist/gstc").Columns}
 */
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

function itemSlot(vido, props) {
  const { onChange, html, cache } = vido;

  let position;

  function updatePosition() {
    if (props && props.itemData) {
      position = props.itemData.position;
    }
  }

  updatePosition();

  onChange((changedProps) => {
    // if current element is reused to display other item data just update your data so when you click you will display right alert
    props = changedProps;
    updatePosition();
  });

  function onClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    alert(props.item.label);
  }

  // return render function
  return (content) =>
    cache(
      props && props.item
        ? html`${content}${html`<div
            class="dot"
            data-gstcid=${props.item.id}
            data-type="chart-timeline-items-row-item"
            @click="${onClick}"
            style="${`left: ${position.actualLeft}px; top: ${position.rowTop}px`}"
          ></div>`}`
        : null
    );
}

/**
 * @type {import("../../dist/gstc").Config}
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
    items: {},
    time: {
      zoom: 20.7,
    },
  },
  slots: {
    'chart-timeline-items-row-item': { outer: [itemSlot] },
  },
};

state = GSTC.api.stateFromConfig(config);
const element = document.getElementById('gstc');

gstc = GSTC({
  element,
  state,
});

const genScreenStyle = document.getElementById('gen').style;

function showLoadingScreen() {
  genScreenStyle.display = 'block';
}

function hideLoadingScreen() {
  genScreenStyle.display = 'none';
}

function generate() {
  generateNewRows();
  generateNewItems();
}

// state.update('config', (config) => {
//   config.list.rows = data.rows;
//   config.chart.items = data.items;
//   return config;
// });

function update(count) {
  showLoadingScreen();
  setTimeout(() => {
    iterations = count;
    generate();
    state.update('config', (config) => {
      config.list.rows = rows;
      config.chart.items = items;
      return config;
    });
    hideLoadingScreen();
  }, 0);
}

update(500);

//@ts-ignore
globalThis.state = state;
//@ts-ignore
globalThis.gstc = gstc;
