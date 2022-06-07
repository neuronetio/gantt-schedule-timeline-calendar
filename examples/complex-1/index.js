import GSTC from '../../dist/gstc.esm.min.js';
// or when you encounter problems with wasm loader
//import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';
import { Plugin as CalendarScroll } from '../../dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as HighlightWeekends } from '../../dist/plugins/highlight-weekends.esm.min.js';
import { Plugin as ProgressBar } from '../../dist/plugins/progress-bar.esm.min.js';
import { Plugin as TimeBookmarks } from '../../dist/plugins/time-bookmarks.esm.min.js';
import { Plugin as DependencyLines } from '../../dist/plugins/dependency-lines.esm.min.js';
import { Plugin as ExportImage } from '../../dist/plugins/export-image.esm.min.js';
import { Plugin as ExportPDF } from '../../dist/plugins/export-pdf.esm.min.js';

globalThis.GSTC = GSTC;

const iterations = 100;
const GSTCID = GSTC.api.GSTCID;
const addDays = 30;

function getRandomFaceImage() {
  return `./faces/face-${Math.ceil(Math.random() * 50)}.jpg`;
}

const colors = ['#E74C3C', '#DA3C78', '#7E349D', '#0077C0', '#07ABA0', '#0EAC51', '#F1892D'];
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const startDate = GSTC.api.date('2020-02-01');
const startTime = startDate.valueOf();
const endDate = GSTC.api.date('2020-03-31').endOf('day');

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
    vacations: [],
    img: getRandomFaceImage(),
    progress: Math.floor(Math.random() * 100),
  };
}

rows[GSTCID('3')].vacations = [
  startDate.add(5, 'days').startOf('day').format('YYYY-MM-DD'),
  startDate.add(6, 'days').startOf('day').format('YYYY-MM-DD'),
];

rows[GSTCID('11')].label = 'NESTED TREE HERE';
rows[GSTCID('12')].parentId = GSTCID('11');
rows[GSTCID('13')].parentId = GSTCID('12');
rows[GSTCID('14')].parentId = GSTCID('13');

rows[GSTCID('7')].birthday = startDate.add(3, 'day').startOf('day').format('YYYY-MM-DD');

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
    progress: Math.round(Math.random() * 100),
    style: { background: getRandomColor() },
    time: {
      start: startDayjs.startOf('day').valueOf(),
      end,
    },
    rowId,
    img: getRandomFaceImage(),
    description: 'Lorem ipsum dolor sit amet',
  };
}

items[GSTCID('0')].linkedWith = [GSTCID('1')];
items[GSTCID('0')].label = 'Task 0 linked with 1';
items[GSTCID('0')].type = 'task';
items[GSTCID('1')].label = 'Task 1 linked with 0';
items[GSTCID('1')].type = 'task';
items[GSTCID('1')].time = { ...items[GSTCID('0')].time };

items[GSTCID('0')].style = { background: colors[3] };
items[GSTCID('1')].style = { background: colors[3] };

items[GSTCID('3')].dependant = [GSTCID('5')];
items[GSTCID('3')].label = 'Grab and move me into vacation area';
items[GSTCID('3')].time.start = GSTC.api.date(startTime).add(4, 'day').startOf('day').add(5, 'day').valueOf();
items[GSTCID('3')].time.end = GSTC.api.date(items[GSTCID('3')].time.start).endOf('day').add(5, 'day').valueOf();

items[GSTCID('5')].time.start = GSTC.api.date(items[GSTCID('3')].time.end).startOf('day').add(5, 'day').valueOf();
items[GSTCID('5')].time.end = GSTC.api.date(items[GSTCID('5')].time.start).endOf('day').add(2, 'day').valueOf();
items[GSTCID('5')].dependant = [GSTCID('7'), GSTCID('9')];

items[GSTCID('7')].time.start = GSTC.api.date(items[GSTCID('5')].time.end).startOf('day').add(3, 'day').valueOf();
items[GSTCID('7')].time.end = GSTC.api.date(items[GSTCID('7')].time.start).endOf('day').add(2, 'day').valueOf();
items[GSTCID('9')].time.start = GSTC.api.date(items[GSTCID('5')].time.end).startOf('day').add(2, 'day').valueOf();
items[GSTCID('9')].time.end = GSTC.api.date(items[GSTCID('9')].time.start).endOf('day').add(3, 'day').valueOf();

const columns = {
  data: {
    [GSTCID('id')]: {
      id: GSTCID('id'),
      data: ({ row }) => GSTC.api.sourceID(row.id),
      width: 80,
      sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
      header: {
        content: 'ID',
      },
    },
    [GSTCID('label')]: {
      id: GSTCID('label'),
      data: 'label',
      sortable: 'label',
      expander: true,
      isHTML: false,
      width: 335,
      header: {
        content: 'Label',
      },
    },
    [GSTCID('progress')]: {
      id: GSTCID('progress'),
      data({ row, vido }) {
        return vido.html`<div style="text-align:center">${row.progress}</div>`;
      },
      width: 80,
      sortable: 'progress',
      header: {
        content: 'Progress',
      },
    },
  },
};

const bookmarks = {
  now: {
    time: GSTC.api.date().valueOf(),
    label: 'Now',
    style: {
      background: '#3498DB',
      fontWeight: 'bold',
    },
  },
};

for (let i = 0; i < 5; i++) {
  const id = `Bookmark ${i}`;
  bookmarks[id] = {
    time: GSTC.api
      .date()
      .add(Math.round(Math.random() * addDays), 'day')
      .startOf('day')
      .valueOf(),
    label: id,
  };
}

function itemSlot(vido, props) {
  const { html, onChange, update } = vido;

  let imageSrc = '';
  let description = '';
  onChange((newProps) => {
    props = newProps;
    if (!props || !props.item) return;
    imageSrc = props.item.img;
    description = props.item.description;
    update();
  });

  return (content) =>
    html`<div
        class="item-image"
        style="background:url(${imageSrc}),transparent;flex-shrink:0;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: 4px 11px 0px 0px;"
      ></div>
      <div class="item-text">
        <div class="item-label">${content}</div>
        <div class="item-description" style="font-size:11px;margin-top:2px;color:#fffffff0;line-height:1em;">
          ${description}
        </div>
      </div>`;
}

function rowSlot(vido, props) {
  const { html, onChange, update, api } = vido;

  let img = '';
  onChange((newProps) => {
    props = newProps;
    if (!props || !props.row) return;
    img = props.row.img;
    update();
  });

  return (content) => {
    if (!props || !props.column) return content;
    return api.sourceID(props.column.id) === 'label'
      ? html`<div class="row-content-wrapper" style="display:flex">
          <div class="row-content" style="flex-grow:1;">${content}</div>
          <div
            class="row-image"
            style="background:url(${img}),transparent;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: 11px 11px 0px 0px;"
          ></div>
        </div>`
      : content;
  };
}

function onCellCreateVacation({ time, row, vido, content }) {
  if (row.vacations.includes(time.leftGlobalDate.format('YYYY-MM-DD'))) {
    return vido.html`<div title="🏖️ VACATION" style="height:100%"><div style="font-size:11px;background:#A0A0A0;color:white;">Vacation</div></div>${content}`;
  }
  return content;
}

function onCellCreateBirthday({ time, row, vido, content }) {
  if (row.birthday === time.leftGlobalDate.format('YYYY-MM-DD')) {
    return vido.html`${content}<div title="🎁 BIRTHDAY" style="height:100%;font-size:18px;"><div style="font-size:11px;background:#F9B32F;color:white;margin-bottom:10px;">🎁 Birthday</div></div>`;
  }
  return content;
}

/**
 * @type {import('../../dist/plugins/item-movement').Options}
 */
const itemMovementOptions = {
  events: {
    onMove({ items }) {
      for (let i = 0, len = items.after.length; i < len; i++) {
        const item = items.after[i];
        const row = gstc.api.getRow(item.rowId);
        for (const vacation of row.vacations) {
          const vacationStart = gstc.api.time.date(vacation).startOf('day').valueOf();
          const vacationEnd = gstc.api.time.date(vacation).endOf('day').valueOf();
          // item start time inside vacation
          if (item.time.start >= vacationStart && item.time.start <= vacationEnd) {
            return items.before;
          }
          // item end time inside vacation
          if (item.time.end >= vacationStart && item.time.end <= vacationEnd) {
            return items.before;
          }
          // vacation is between item start and end
          if (item.time.start <= vacationStart && item.time.end >= vacationEnd) {
            return items.before;
          }
          // item start and end time is inside vacation
          if (item.time.start >= vacationStart && item.time.end <= vacationEnd) {
            return items.before;
          }
        }
      }
      return items.after;
    },
  },
};

/**
 * @type {import('../../dist/plugins/item-resizing').Options}
 */
const itemResizeOptions = {
  events: {
    onResize({ items }) {
      for (const item of items.after) {
        const row = gstc.api.getRow(item.rowId);
        for (const vacation of row.vacations) {
          const vacationStart = gstc.api.time.date(vacation).startOf('day').valueOf();
          const vacationEnd = gstc.api.time.date(vacation).endOf('day').valueOf();
          // item start time inside vacation
          if (item.time.start >= vacationStart && item.time.start <= vacationEnd) {
            return items.before;
          }
          // item end time inside vacation
          if (item.time.end >= vacationStart && item.time.end <= vacationEnd) {
            return items.before;
          }
          // vacation is between item start and end
          if (item.time.start <= vacationStart && item.time.end >= vacationEnd) {
            return items.before;
          }
          // item start and end time is inside vacation
          if (item.time.start >= vacationStart && item.time.end <= vacationEnd) {
            return items.before;
          }
        }
      }
      return items.after;
    },
  },
};

/**
 * @type {import('../../dist/gstc').Config}
 */
const config = {
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 500,
  //autoInnerHeight: true,
  plugins: [
    HighlightWeekends(),
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing(itemResizeOptions), // resizing must fo before movement
    ItemMovement(itemMovementOptions),
    CalendarScroll(),
    ProgressBar(),
    TimeBookmarks({
      bookmarks,
    }),
    DependencyLines({
      onLine: [
        (line) => {
          line.type = GSTC.api.sourceID(line.fromItem.id) === '3' ? 'smooth' : 'square';
          return line;
        },
      ],
    }),
    ExportImage(),
    ExportPDF(),
  ],
  list: {
    row: {
      height: 68,
    },
    rows,
    columns,
  },
  chart: {
    time: {
      from: startDate.valueOf(),
      to: endDate.valueOf(),
    },
    item: {
      height: 50,
      gap: {
        top: 14,
        //bottom: 0,
      },
    },
    items,
    grid: {
      cell: {
        onCreate: [onCellCreateVacation, onCellCreateBirthday],
      },
    },
  },
  scroll: {
    vertical: { precise: true },
    horizontal: { precise: true },
  },
  slots: {
    'chart-timeline-items-row-item': { content: [itemSlot] },
    'list-column-row': { content: [rowSlot] },
  },
  //utcMode: true,
};

let gstc;
let state = GSTC.api.stateFromConfig(config);
(async function mountGSTC() {
  const element = document.getElementById('gstc');

  gstc = GSTC({
    element,
    state,
  });

  //@ts-ignore
  globalThis.state = state;
  //@ts-ignore
  globalThis.gstc = gstc;
})();

// TOOLBOX BUTTONS

// Select first two cells
function selectCells() {
  const api = gstc.api;
  const allCells = api.getGridCells();
  api.plugins.Selection.selectCells([allCells[0].id, allCells[1].id]);
  console.log(api.plugins.Selection.getSelection());
}

// scroll to first item
function scrollToFirstItem() {
  const api = gstc.api;
  const firstItem = gstc.state.get(`config.chart.items.${api.GSTCID('1')}`);
  api.scrollToTime(firstItem.time.start, false);
}

function makeSelectedItemsDependent() {
  const ITEM = 'chart-timeline-items-row-item';
  const selectedItems = gstc.api.plugins.Selection.getSelected()[ITEM];
  console.log('selected items', selectedItems);
  selectedItems.forEach((item, index, all) => {
    if (index + 1 < all.length) {
      state.update(`config.chart.items.${item.id}.dependant`, [all[index + 1].id]);
    }
  });
}

function oneMonth() {
  state.update('config.chart.time', (time) => {
    time.calculatedZoomMode = true;
    time.from = startDate.startOf('month').valueOf();
    time.to = startDate.endOf('month').valueOf();
    return time;
  });
}

globalThis.scrollToFirstItem = scrollToFirstItem;

function downloadImage() {
  gstc.api.plugins.ExportImage.download();
}

function downloadPdf() {
  gstc.api.plugins.ExportPDF.download('timeline.pdf');
}

let darkModeEnabled = false;
function toggleDarkMode(ev) {
  darkModeEnabled = ev.target.checked;
  const el = document.getElementById('gstc');
  if (darkModeEnabled) {
    el.classList.add('gstc--dark');
    document.body.classList.add('gstc--dark');
  } else {
    el.classList.remove('gstc--dark');
    document.body.classList.remove('gstc--dark');
  }
}

const lithtml = GSTC.lithtml;

const toolboxButtons = lithtml.html`<button @click=${selectCells}>Select first cells</button>
      <button @click=${scrollToFirstItem}>Scroll to first item</button>
      <button @click=${downloadImage}>Download image</button>
      <button @click=${downloadPdf}>Download PDF</button>
      <button id="one-month" @click=${oneMonth}>Show one month</button>
      <input type="checkbox" id="dark-mode" @change=${toggleDarkMode} /> <label for="dark-mode">Dark mode</label>`;

lithtml.render(toolboxButtons, document.getElementById('toolbox'));
