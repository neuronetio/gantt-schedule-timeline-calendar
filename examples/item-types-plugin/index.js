import GSTC from '../../dist/gstc.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';
import { Plugin as CalendarScroll } from '../../dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as HighlightWeekends } from '../../dist/plugins/highlight-weekends.esm.min.js';
import { Plugin as DependencyLines } from '../../dist/plugins/dependency-lines.esm.min.js';
import { Plugin as ItemTypes } from '../../dist/plugins/item-types.esm.min.js';

const iterations = 100;
const GSTCID = GSTC.api.GSTCID;

const colors = ['#E74C3C', '#DA3C78', '#7E349D', '#0077C0', '#07ABA0', '#0EAC51', '#F1892D'];
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const itemTypes = ['project', 'milestone', 'task'];

function getRandomItemType() {
  return itemTypes[Math.floor(Math.random() * itemTypes.length)];
}

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = GSTCID(i);
  rows[id] = {
    id,
    label: `Row ${i}`,
    parentId: withParent ? GSTCID(i - 1) : undefined,
    expanded: false,
  };
}

rows[GSTCID('11')].label = 'NESTED TREE HERE';
rows[GSTCID('12')].parentId = GSTCID('11');
rows[GSTCID('13')].parentId = GSTCID('12');
rows[GSTCID('14')].parentId = GSTCID('13');

const startDate = GSTC.api.date().subtract(2, 'month').valueOf();

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId = GSTCID(i);
  let id = GSTCID(i);
  let startDayjs = GSTC.api
    .date(startDate)
    .startOf('day')
    .add(Math.floor(Math.random() * 30), 'days');
  const type = getRandomItemType();
  items[id] = {
    id,
    label: type + ' id ' + GSTC.api.sourceID(id),
    progress: Math.round(Math.random() * 100),
    type,
    fill: getRandomColor(),
    time: {
      start: startDayjs.startOf('day').valueOf(),
      end: startDayjs
        .clone()
        .add(Math.floor(Math.random() * 20) + 4, 'days')
        .endOf('day')
        .valueOf(),
    },
    rowId,
  };
}

items[GSTCID('0')].linkedWith = [GSTCID('1')];
items[GSTCID('0')].label = 'Task 0 linked with 1 (clone)';
items[GSTCID('0')].type = 'task';
items[GSTCID('0')].fill = colors[0];
items[GSTCID('1')].fill = colors[0];
items[GSTCID('1')].label = 'Task 1 linked with 0 (clone)';
items[GSTCID('1')].type = 'task';
items[GSTCID('1')].time = { ...items[GSTCID('0')].time };

items[GSTCID('3')].dependant = [GSTCID('5')];
items[GSTCID('3')].time.start = GSTC.api.date(startDate).add(2, 'day').startOf('day').add(5, 'day').valueOf();
items[GSTCID('3')].time.end = GSTC.api.date(items[GSTCID('3')].time.start).endOf('day').add(2, 'day').valueOf();

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
      resizer: false,
    },
    [GSTCID('label')]: {
      id: GSTCID('label'),
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

const config = {
  //debug: true,
  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 500,
  plugins: [
    TimelinePointer(),
    Selection(),
    ItemResizing({
      snapToTime: {
        start({ startTime }) {
          return startTime;
        },
        end({ endTime }) {
          return endTime;
        },
      },
    }),
    ItemMovement({
      snapToTime: {
        start({ startTime }) {
          return startTime;
        },
      },
      autoScroll: {
        speed: {
          horizontal: 1,
          vertical: 1,
        },
      },
    }),
    CalendarScroll(),
    //ProgressBar(),
    HighlightWeekends(),
    DependencyLines(),
    ItemTypes(),
  ],
  list: {
    rows,
    columns,
  },
  chart: {
    items,
  },
  scroll: {
    vertical: {
      precise: false,
    },
  },
  slots: {
    // item content slot that will show circle with letter next to item label
    'chart-timeline-items-row-item': {
      content: [
        (vido, props) => {
          const { onChange, html } = vido;
          let letter = props.item.label.charAt(0).toUpperCase();
          onChange((newProps) => {
            if (newProps && newProps.item) {
              props = newProps;
              letter = props.item.label.charAt(0).toUpperCase();
            }
          });
          return (content) => {
            if (!props || !props.item) return content;
            return html`<div
                class="item-img"
                style="width:24px;height:24px;background:${props.item
                  .imgColor};border-radius:100%;text-align:center;line-height:24px;font-weight:bold;margin-right:10px;"
              >
                ${letter}
              </div>
              ${content}`;
          };
        },
      ],
    },
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

// for testing
// @ts-ignore
window.state = state;

// Mount the component
const app = GSTC({
  element: document.getElementById('gstc'),
  state,
});

//for testing
// @ts-ignore
window.gstc = app;
