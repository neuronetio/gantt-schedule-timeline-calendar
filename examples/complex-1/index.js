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

function getInitialRows() {
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
      visible: true,
    };
  }

  rows[GSTCID('11')].label = 'NESTED TREE HERE';
  rows[GSTCID('12')].parentId = GSTCID('11');
  rows[GSTCID('13')].parentId = GSTCID('12');
  rows[GSTCID('14')].parentId = GSTCID('13');
  rows[GSTCID('3')].vacations = [
    { from: startDate.add(5, 'days').startOf('day').valueOf(), to: startDate.add(5, 'days').endOf('day').valueOf() },
    { from: startDate.add(6, 'days').startOf('day').valueOf(), to: startDate.add(6, 'days').endOf('day').valueOf() },
  ];
  rows[GSTCID('7')].birthday = [
    {
      from: startDate.add(3, 'day').startOf('day').valueOf(),
      to: startDate.add(3, 'day').endOf('day').valueOf(),
    },
  ];
  return rows;
}

function generateItemsForDaysView() {
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
      classNames: ['additional-custom-class'],
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
  return items;
}

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
      width: 315,
      header: {
        content: 'Label',
      },
    },
    [GSTCID('progress')]: {
      id: GSTCID('progress'),
      data({ row, vido }) {
        return vido.html`<div style="text-align:center">${row.progress}</div>`;
      },
      width: 100,
      sortable: 'progress',
      header: {
        content: 'Progress',
      },
    },
  },
};

/**
 * @type {import("../../dist/plugins/time-bookmarks").Bookmarks}
 */
const bookmarks = {};
for (let i = 0; i < 3; i++) {
  const id = `Bookmark ${i}`;
  bookmarks[id] = {
    time: startDate
      .add(Math.round(Math.random() * addDays), 'day')
      .startOf('day')
      .valueOf(),
    label: id,
    style: {
      background: getRandomColor(),
    },
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
            style="background:url(${img}),transparent;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: auto 10px;flex-shrink:0;"
          ></div>
        </div>`
      : content;
  };
}

let snapTime = true;
function snapStart({ startTime, vido }) {
  if (!snapTime) return startTime;
  const date = vido.api.time.findOrCreateMainDateAtTime(startTime.valueOf());
  return date.leftGlobalDate;
}
function snapEnd({ endTime, vido }) {
  if (!snapTime) return endTime;
  const date = vido.api.time.findOrCreateMainDateAtTime(endTime.valueOf());
  return date.rightGlobalDate;
}

function canMove(item) {
  const row = gstc.api.getRow(item.rowId);
  if (row.vacations) {
    for (const vacation of row.vacations) {
      const vacationStart = vacation.from;
      const vacationEnd = vacation.to;
      // item start time inside vacation
      if (item.time.start >= vacationStart && item.time.start <= vacationEnd) {
        return false;
      }
      // item end time inside vacation
      if (item.time.end >= vacationStart && item.time.end <= vacationEnd) {
        return false;
      }
      // vacation is between item start and end
      if (item.time.start <= vacationStart && item.time.end >= vacationEnd) {
        return false;
      }
      // item start and end time is inside vacation
      if (item.time.start >= vacationStart && item.time.end <= vacationEnd) {
        return false;
      }
    }
  }
  return true;
}

/**
 * @type {import('../../dist/plugins/item-movement').Options}
 */
const itemMovementOptions = {
  threshold: {
    horizontal: 25,
    vertical: 25,
  },
  snapToTime: {
    start: snapStart,
    end({ endTime }) {
      return endTime;
    },
  },
  events: {
    onMove({ items }) {
      for (let i = 0, len = items.after.length; i < len; i++) {
        const item = items.after[i];
        if (!canMove(item)) return items.before;
      }
      return items.after;
    },
  },
};

/**
 * @type {import('../../dist/plugins/item-resizing').Options}
 */
const itemResizeOptions = {
  threshold: 25,
  snapToTime: {
    start: snapStart,
    end: snapEnd,
  },
  events: {
    onResize({ items }) {
      for (const item of items.after) {
        if (!canMove(item)) return items.before;
      }
      return items.after;
    },
  },
};

let hideWeekends = false;
function onLevelDates({ dates, level, format, time }) {
  if (time.period !== 'day') return dates;
  if (format.period !== time.period) return dates;
  if (!hideWeekends) return dates;
  return dates.filter((date) => date.leftGlobalDate.day() !== 0 && date.leftGlobalDate.day() !== 6);
}

function onItemClick(ev) {
  const itemElement = ev.target.closest('.gstc__chart-timeline-items-row-item');
  const itemId = itemElement.dataset.gstcid;
  const item = gstc.api.getItem(itemId);
  console.log('Item click from template', item);
}

/**
 * @type {import('../../dist/gstc').Template}
 */
function chartTimelineItemsRowItemTemplate({
  className,
  labelClassName,
  styleMap,
  cache,
  shouldDetach,
  cutterLeft,
  cutterRight,
  getContent,
  actions,
  slots,
  html,
  vido,
  props,
}) {
  const detach = shouldDetach || !props || !props.item;
  return cache(
    detach
      ? null
      : slots.html(
          'outer',
          html`
            <div
              class=${className}
              data-gstcid=${props.item.id}
              data-actions=${actions()}
              style=${styleMap.directive()}
              @click=${onItemClick}
            >
              ${slots.html(
                'inner',
                html`
                  ${cutterLeft()}
                  <div class=${labelClassName}>${slots.html('content', getContent())}</div>
                  ${cutterRight()}
                `
              )}
            </div>
          `
        )
  );
}

function myItemSlot(vido, props) {
  const { onChange } = vido;

  function onClick() {
    console.log('Item click from slot', props.item);
  }

  onChange((changedProps) => {
    // if current element is reused to display other item data just update your data so when you click you will display right alert
    props = changedProps;
  });

  // return render function
  return (content) =>
    vido.html`<div class="my-item-wrapper" @click=${onClick} style="width:100%;display:flex;overflow:hidden;pointer-events:none;">${content}</div>`;
}

function onCellCreateVacation({ time, row, vido, content }) {
  if (!row.vacations) return content;
  let isVacation = false;
  for (const vacation of row.vacations) {
    if (time.leftGlobal >= vacation.from && time.rightGlobal <= vacation.to) {
      isVacation = true;
      break;
    }
  }
  if (isVacation) {
    return vido.html`<div title="🏖️ VACATION" style="height:100%;width:100%;background:#A0A0A010;"></div>${content}`;
  }
  return content;
}

function myVacationRowSlot(vido, props) {
  const { onChange, html, update, api, state } = vido;

  let vacationContent = [];
  onChange((changedProps) => {
    props = changedProps;
    if (!props || !props.row || !props.row.vacations) {
      vacationContent = [];
      return update();
    }
    const configTime = state.get('config.chart.time');
    vacationContent = [];
    for (const vacation of props.row.vacations) {
      if (vacation.to < configTime.leftGlobal || vacation.from > configTime.rightGlobal) continue; // birthday date is out of the current view
      const leftPx = api.time.getViewOffsetPxFromDates(api.time.date(vacation.from));
      const rightPx = api.time.getViewOffsetPxFromDates(api.time.date(vacation.to));
      const widthPx = rightPx - leftPx - 1;
      if (widthPx < 0) continue;
      let textAlign = 'left';
      if (widthPx <= 100) textAlign = 'center';
      vacationContent.push(
        html`<div
          style="position:absolute;left:${leftPx}px;width:${widthPx}px;height:14px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;font-size:11px;background:#A0A0A0;color:white;text-align:${textAlign};"
        >
          Vacation
        </div>`
      );
    }
    update();
  });

  return (content) => html`${vacationContent}${content}`;
}

function onCellCreateBirthday({ time, row, vido, content }) {
  if (!row.birthday) return content;
  let isBirthday = false;
  for (const birthday of row.birthday) {
    if (time.leftGlobal >= birthday.from && time.rightGlobal <= birthday.to) {
      isBirthday = true;
      break;
    }
  }
  if (isBirthday) {
    return vido.html`<div title="🎁 BIRTHDAY" style="height:100%;width:100%;font-size:18px;background:#F9B32F10;"></div>${content}`;
  }
  return content;
}

function myBirthdayRowSlot(vido, props) {
  const { onChange, html, update, api, state } = vido;

  let birthdayContent = [];
  onChange((changedProps) => {
    props = changedProps;
    if (!props || !props.row || !props.row.birthday) {
      birthdayContent = [];
      return update();
    }
    const configTime = state.get('config.chart.time');
    birthdayContent = [];
    for (const birthday of props.row.birthday) {
      if (birthday.to < configTime.leftGlobal || birthday.from > configTime.rightGlobal) continue; // birthday date is out of the current view
      const leftPx = api.time.getViewOffsetPxFromDates(api.time.date(birthday.from));
      const rightPx = api.time.getViewOffsetPxFromDates(api.time.date(birthday.to));
      const widthPx = rightPx - leftPx - 1;
      if (widthPx < 0) continue;
      let textAlign = 'left';
      if (widthPx <= 100) textAlign = 'center';
      birthdayContent.push(
        html`<div
          style="position:absolute;left:${leftPx}px;width:${widthPx}px;height:14px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;font-size:11px;background:#F9B32F;color:white;text-align:${textAlign};"
        >
          🎁 Birthday
        </div>`
      );
    }
    update();
  });

  return (content) => html`${birthdayContent}${content}`;
}

/**
 * @type {import('../../dist/gstc').Config}
 */
const config = {
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 700,
  //autoInnerHeight: true,
  plugins: [
    HighlightWeekends(),
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection({
      events: {
        onEnd(selected) {
          console.log('Selected', selected);
          return selected;
        },
      },
    }),
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
    rows: getInitialRows(),
    columns,
  },
  chart: {
    time: {
      from: startDate.valueOf(),
      to: endDate.valueOf(),
      onLevelDates: [onLevelDates],
    },
    item: {
      height: 50,
      gap: {
        top: 14,
        //bottom: 0,
      },
    },
    items: generateItemsForDaysView(),
    grid: {
      cell: {
        onCreate: [onCellCreateVacation, onCellCreateBirthday],
      },
    },
  },
  scroll: {
    vertical: { precise: true, byPixels: true },
    horizontal: { precise: true, byPixels: true },
  },
  slots: {
    'chart-timeline-items-row-item': { content: [itemSlot], inner: [myItemSlot] },
    'list-column-row': { content: [rowSlot] },
    'chart-timeline-grid-row': { content: [myBirthdayRowSlot, myVacationRowSlot] },
  },
  templates: {
    'chart-timeline-items-row-item': chartTimelineItemsRowItemTemplate,
  },
  //utcMode: true,
};

let gstc;
let state;
function mountGSTC() {
  state = GSTC.api.stateFromConfig(config);
  const element = document.createElement('div');
  element.id = 'gstc';
  document.querySelector('#toolbox')?.after(element);
  gstc = GSTC({
    element,
    state,
  });
  //@ts-ignore
  globalThis.state = state;
  //@ts-ignore
  globalThis.gstc = gstc;
}

mountGSTC();

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
    el?.classList.add('gstc--dark');
    document.body.classList.add('gstc--dark');
  } else {
    el?.classList.remove('gstc--dark');
    document.body.classList.remove('gstc--dark');
  }
}

function toggleHideWeekends(ev) {
  hideWeekends = ev.target.checked;
  gstc.api.time.recalculateTime();
}

function toggleSnapTime(ev) {
  snapTime = ev.target.checked;
}

function toggleExpandTime(ev) {
  const expandTime = ev.target.checked;
  const moveOutEl = document.getElementById('move-out');
  if (moveOutEl && expandTime) {
    // @ts-ignore
    moveOutEl.checked = expandTime;
    toggleMoveOut({ target: moveOutEl });
  }
  state.update('config.chart.time.autoExpandTimeFromItems', expandTime);
}

function toggleMoveOut(ev) {
  const moveOut = ev.target.checked;
  const expandTimeEl = document.getElementById('expand-time');
  if (expandTimeEl && !moveOut) {
    // @ts-ignore
    expandTimeEl.checked = moveOut;
    toggleExpandTime({ target: expandTimeEl });
  }
  state.update('config.plugin.ItemMovement.allowItemsToGoOutsideTheArea', moveOut);
  state.update('config.plugin.ItemResizing.allowItemsToGoOutsideTheArea', moveOut);
}

function zoomChange(ev) {
  const period = ev.target.value;
  let zoom = 20;
  let from = gstc.api.time.date('2020-02-1').startOf('day').valueOf();
  let to = gstc.api.time.date('2020-03-01').endOf('month').valueOf();
  switch (period) {
    case 'hours':
      zoom = 16;
      from = gstc.api.time.date('2020-02-01').startOf('day').valueOf();
      to = gstc.api.time.date('2020-03-01').endOf('month').valueOf();
      break;
    case 'days':
      zoom = 20;
      from = gstc.api.time.date('2020-02-01').startOf('day').valueOf();
      to = gstc.api.time.date('2020-03-01').endOf('month').valueOf();
      break;
    case 'months':
      zoom = 26;
      from = gstc.api.time.date('2018-01-01').startOf('day').valueOf();
      to = gstc.api.time.date('2021-01-10').endOf('year').valueOf();
      break;
  }

  state.update('config.chart.time', (time) => {
    time.zoom = zoom;
    time.from = from;
    time.to = to;
    return time;
  });
}

function searchRows(event) {
  const copiedRows = getInitialRows();
  const search = String(event.target.value).trim();
  console.log('search', search);
  const regex = new RegExp(`[\s\S]?${search}[\s\S]?`, 'gi');
  const rowsToKeep = [];
  for (const rowId in copiedRows) {
    const row = copiedRows[rowId];
    const rowData = gstc.api.getRowData(rowId);
    if (regex.test(row.label)) {
      rowsToKeep.push(rowId);
      for (const childRowId of rowData.allChildren) {
        rowsToKeep.push(childRowId);
      }
      for (const parentRowId of rowData.parents) {
        rowsToKeep.push(parentRowId);
        if (search) copiedRows[parentRowId].expanded = true;
      }
    }
    regex.lastIndex = 0;
  }
  const uniqueRowsToKeep = [...new Set(rowsToKeep)]; // js way to get only unique row id's- we don't want duplicates here
  for (const rowId in copiedRows) {
    if (uniqueRowsToKeep.includes(rowId)) {
      copiedRows[rowId].visible = true;
    } else {
      copiedRows[rowId].visible = false;
    }
  }
  state.update('config.list.rows', (currentRows) => {
    return copiedRows;
  });
}

const historyStates = [];
globalThis.historyStates = historyStates;
let currentStateName = '';
function saveCurrentState(stateName) {
  const items = GSTC.api.merge({}, state.get('config.chart.items'));
  historyStates.push({ name: stateName, state: items });
  currentStateName = stateName;
  updateToolBox();
}

function restoreState(stateName) {
  const historyState = historyStates.find((s) => s.name == stateName);
  currentStateName = stateName;
  const clonedState = GSTC.api.merge({}, historyState.state);
  state.update('config.chart.items', clonedState);
  updateToolBox();
}

function onRestoreStateChange(ev) {
  const name = ev.target.value;
  restoreState(name);
}

function openSaveCurrentStateDialog() {
  const stateName = prompt('Enter current state name');
  saveCurrentState(stateName);
}

function deleteSelectedItems() {
  const selectedItems = gstc.api.plugins.Selection.getSelected()['chart-timeline-items-row-item']; // cloned items
  gstc.api.plugins.Selection.selectItems([]); // clear selection
  state.update('config.plugin.Selection.lastSelecting.chart-timeline-items-row-item', []);
  state.update('config.chart.items', (items) => {
    for (const item of selectedItems) {
      delete items[item.id];
    }
    return items;
  });
}

const html = GSTC.lithtml.html;

function updateToolBox() {
  const searchBoxHTML = html`<input type="text" @input=${searchRows} placeholder="Search" />`;
  const historyStateHTML = html`<button @click="${openSaveCurrentStateDialog}">Save items</button>
    <label>Restore items:</label>
    <select @change=${onRestoreStateChange}>
      ${historyStates.map(
        (historyState) =>
          html`<option value=${historyState.name} ?selected=${historyState.name === currentStateName}>
            ${historyState.name}
          </option>`
      )}
    </select>`;

  const toolboxButtons = html` <div class="toolbox-row">
      <div class="toolbox-item"><button @click=${selectCells}>Select first cells</button></div>
      <div class="toolbox-item"><button @click=${scrollToFirstItem}>Scroll to first item</button></div>
      <div class="toolbox-item"><button @click=${downloadImage}>Download image</button></div>
      <div class="toolbox-item"><button @click=${downloadPdf}>Download PDF</button></div>
      <div class="toolbox-item">${historyStateHTML}</div>
      <div class="toolbox-item">
        <label>Zoom:</label>
        <select @change="${zoomChange}" id="zoom">
          <option value="hours">Hours</option>
          <option value="days" selected>Days</option>
          <option value="months">Months</option>
        </select>
      </div>
      <div class="toolbox-item">
        <button @click=${deleteSelectedItems}>Delete selected items</button>
      </div>
    </div>
    <div class="toolbox-row">
      <div class="toolbox-item">${searchBoxHTML}</div>
      <div class="toolbox-item">
        <input type="checkbox" id="dark-mode" @change=${toggleDarkMode} /> <label for="dark-mode">Dark mode</label>
      </div>
      <div class="toolbox-item">
        <input type="checkbox" id="snap-time" @change=${toggleSnapTime} checked />
        <label for="snap-time">Snap time (item movement)</label>
      </div>
      <div class="toolbox-item">
        <input type="checkbox" id="hide-weekends" @change=${toggleHideWeekends} />
        <label for="hide-weekends">Hide weekends</label>
      </div>
      <div class="toolbox-item">
        <input type="checkbox" id="expand-time" @change=${toggleExpandTime} />
        <label for="expand-time">Expand view when item is outside</label>
      </div>
      <div class="toolbox-item">
        <input type="checkbox" id="move-out" @change=${toggleMoveOut} checked />
        <label for="move-out">Alow items to move outside area</label>
      </div>
    </div>`;
  // @ts-ignore
  GSTC.lithtml.render(toolboxButtons, document.getElementById('toolbox'));
}
updateToolBox();

const gstcEl = document.getElementById('gstc');
gstcEl?.addEventListener('gstc-loaded', () => {
  console.log('GSTC loaded!');
  saveCurrentState('Initial');
});
