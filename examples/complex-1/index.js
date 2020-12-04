import GSTC from '../../dist/gstc.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';
import { Plugin as CalendarScroll } from '../../dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as HighlightWeekends } from '../../dist/plugins/highlight-weekends.esm.min.js';
import { Plugin as ProgressBar } from '../../dist/plugins/progress-bar.esm.min.js';
import { Plugin as TimeBookmarks } from '../../dist/plugins/time-bookmarks.esm.min.js';
import { Plugin as DependencyLines } from '../../dist/plugins/dependency-lines.esm.min.js';

const iterations = 100;
const GSTCID = GSTC.api.GSTCID;

function getRandomFaceImage() {
  return `./faces/face-${Math.ceil(Math.random() * 50)}.jpg`;
}

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = GSTCID(String(i));
  rows[id] = {
    id,
    label: `Lorem ipsum ${i}`,
    parentId: withParent ? GSTCID(String(i - 1)) : undefined,
    expanded: false,
    img: getRandomFaceImage(),
    progress: Math.floor(Math.random() * 100),
  };
}

const startDate = GSTC.api.date().subtract(2, 'month').valueOf();

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId = GSTCID(i);
  let id = GSTCID(i);
  let startDayjs = GSTC.api
    .date(startDate)
    .startOf('day')
    .add(Math.floor((Math.random() * 365) / 2), 'day');
  items[id] = {
    id,
    label: `John Doe ${i}`,
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
    img: getRandomFaceImage(),
    description: 'Lorem ipsum dolor sit amet',
  };
}

items[GSTCID('0')].linkedWith = [GSTCID('1')];
items[GSTCID('1')].time = { ...items[GSTCID('0')].time };

items[GSTCID('3')].dependant = [GSTCID('5')];
items[GSTCID('5')].time.start = items[GSTCID('3')].time.end + 1;
items[GSTCID('5')].time.end = GSTC.api.date(items[GSTCID('5')].time.start).endOf('day').add(2, 'day').valueOf();
items[GSTCID('5')].dependant = [GSTCID('7')];
items[GSTCID('7')].time.start = items[GSTCID('5')].time.end + 1;
items[GSTCID('7')].time.end = GSTC.api.date(items[GSTCID('7')].time.start).endOf('day').add(2, 'day').valueOf();

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
    color: '#3498DB',
    label: 'Now',
  },
};

for (let i = 0; i < 50; i++) {
  const id = `Bookmark ${i}`;
  bookmarks[id] = {
    time: GSTC.api
      .date()
      .add(Math.round(Math.random() * 600) - 300, 'day')
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
    if (!props) return;
    imageSrc = props.item.img;
    description = props.item.description;
    update();
  });

  return (content) =>
    html`<div
        class="item-image"
        style="background:url(${imageSrc}),transparent;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: 4px 11px 0px 0px;"
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
    if (!props) return;
    img = props.row.img;
    update();
  });

  return (content) =>
    api.sourceID(props.column.id) === 'label'
      ? html`<div class="row-content-wrapper" style="display:flex">
          <div class="row-content" style="flex-grow:1;">${content}</div>
          <div
            class="row-image"
            style="background:url(${img}),transparent;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: 11px 11px 0px 0px;"
          ></div>
        </div>`
      : content;
}

const config = {
  //debug: true,
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  plugins: [
    HighlightWeekends(),
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing(), // resizing must fo before movement
    ItemMovement(),
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
  ],
  list: {
    row: {
      height: 58,
    },
    rows,
    columns,
  },
  chart: {
    item: {
      height: 50,
    },
    items,
  },
  scroll: {
    vertical: { precise: true },
  },
  slots: {
    'chart-timeline-items-row-item': { content: [itemSlot] },
    'list-column-row': { content: [rowSlot] },
  },
};

let gstc;
let state = GSTC.api.stateFromConfig(config);
(async function mountGSTC() {
  const element = document.getElementById('gstc');

  element.addEventListener('gstc-loaded', () => {
    gstc.api.scrollToTime(gstc.api.time.date().valueOf()); // eslint-disable-line
  });

  gstc = GSTC({
    element,
    state,
  });

  //@ts-ignore
  window.state = state;
  //@ts-ignore
  window.gstc = gstc;
})();

// Select first two cells
function selectCells() {
  const api = gstc.api;
  const allCells = api.getGridCells();
  api.plugins.selection.selectCells([allCells[0].id, allCells[1].id]);
  //api.plugins.selection.selectItems([api.GSTCID('1')]);
  console.log(api.plugins.selection.getSelection());
}
document.getElementById('select-cells').addEventListener('click', selectCells);

// scroll to first item
function scrollToFirstItem() {
  const api = gstc.api;
  const firstItem = gstc.state.get(`config.chart.items.${api.GSTCID('1')}`);
  api.scrollToTime(firstItem.time.start, false);
}
document.getElementById('scroll-to-item').addEventListener('click', scrollToFirstItem);

// @ts-ignore
window.scrollToFirstItem = scrollToFirstItem;
