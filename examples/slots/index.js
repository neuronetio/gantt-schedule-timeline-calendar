import GSTC from '../../dist/gstc.wasm.esm.min.js';
// or when you encounter problems with wasm loader
// import GSTC from '../../dist/gstc.wasm.esm.min.js';

const iterations = 100;
const GSTCID = GSTC.api.GSTCID;

function getRandomFaceImage() {
  return `./faces/face-${Math.ceil(Math.random() * 50)}.jpg`;
}

const colors = ['#E74C3C', '#DA3C78', '#7E349D', '#0077C0', '#07ABA0', '#0EAC51', '#F1892D'];
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const startDate = GSTC.api.date().subtract(15, 'day');
const startTime = startDate.valueOf();

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = GSTCID(String(i));
  rows[id] = {
    id,
    label: `John Doe ${i}`,
    parentId: withParent ? GSTCID(String(i - 1)) : undefined,
    expanded: false,
    vacations: [],
    img: getRandomFaceImage(),
    progress: Math.floor(Math.random() * 100),
  };
}

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId = GSTCID(i);
  let id = GSTCID(i);
  let startDayjs = GSTC.api
    .date(startTime)
    .startOf('day')
    .add(Math.floor(Math.random() * 30), 'day');
  items[id] = {
    id,
    label: `John Doe ${i}`,
    progress: Math.round(Math.random() * 100),
    style: { background: getRandomColor() },
    time: {
      start: startDayjs.startOf('day').valueOf(),
      end: startDayjs
        .clone()
        .add(Math.floor(Math.random() * 20) + 4, 'day')
        .endOf('day')
        .valueOf(),
    },
    rowId,
    img: getRandomFaceImage(),
    description: 'Lorem ipsum dolor sit amet',
  };
}

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

function itemsSlot(vido) {
  return (content) =>
    vido.html`<div
        class="my-items-slot"
        style="position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(#00000050,#00000000);text-align:center;font-weight:bold;font-size:2rem;"
      >
        My items slot!
      </div>
      ${content}`;
}

function dateSlot(vido, props) {
  const { onChange, update, html } = vido;

  let style = 'cursor: pointer;';

  onChange((newProps) => {
    props = newProps;
    if (!props || !props.date) return;
    const day = props.date.leftGlobalDate.format('DD');
    if (Number(day) % 2 === 0) {
      style = 'background: red;color:white;cursor:pointer;';
    } else {
      style = 'cursor:pointer;';
    }
    update();
  });

  function onDateClick() {
    alert(props.date.leftGlobalDate.format('YYYY-MM-DD') + ' date clicked!');
  }

  return (content) => html`<div class="my-date-slot" style=${style} @click=${onDateClick}>${content}</div>`;
}

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
    rows,
  },
  chart: {
    items,
  },
  slots: {
    'chart-timeline-items': { outer: [itemsSlot] },
    'chart-calendar-date': { outer: [dateSlot] },
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
