import GSTC from '../../dist/gstc.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

let iterations = 500;

let gstc, state;

const fromDate = GSTC.api.date().startOf('month');

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

let secondLevel = null;
function chartCalendarTemplate({ className, styleMap, components, actions, slots, html, vido, props }) {
  return slots.html(
    'outer',
    html`
      <div class=${className} data-actions=${actions()} style=${styleMap.directive()}>
        ${slots.html(
          'inner',
          components.length
            ? components.map((component, level) => {
                if (level === 1) {
                  secondLevel = component;
                  return null;
                }
                return component && component.length
                  ? html`
                      <div class=${className + '-dates ' + className + `-dates--level-${level}`}>
                        ${slots.html(
                          'content',
                          component.map((m) => m.html())
                        )}
                      </div>
                    `
                  : null;
              })
            : null
        )}
      </div>
    `
  );
}

const topContentStyle = new GSTC.api.vido.StyleMap({
  top: '72px',
  position: 'absolute',
  width: '100%',
  display: 'flex',
  background: '#f9fafb',
  height: '50px',
});
function chartTemplate({
  className,
  onWheel,
  ChartCalendar,
  ChartTimeline,
  ScrollBarVertical,
  calculatedZoomMode,
  ScrollBarHorizontal,
  actions,
  slots,
  html,
  vido,
  props,
}) {
  const headerHeight = vido.state.get('config.headerHeight');
  topContentStyle.style.top = headerHeight + 'px';
  const time = state.get('$data.chart.time');
  const mainLevel = time.levels[time.level];
  return slots.html(
    'outer',
    html`
      <div class=${className} data-actions=${actions()} @wheel=${onWheel}>
        <div class="chart-top-content" style="${topContentStyle.directive()}">
          ${mainLevel.map(
            (date) =>
              html`<div
                style="width: ${date.currentView
                  .width}px; border-right:1px solid; overflow:hidden;text-align:center;color:#747a81;"
              >
                ${date.leftGlobalDate.format('DD')}
              </div>`
          )}
        </div>
        ${slots.html(
          'content',
          html`
            ${ChartCalendar.html()}${ChartTimeline.html()}${ScrollBarVertical.html()}
            <div class="second-level-copy">${secondLevel.map((date) => date.html())}</div>
            ${calculatedZoomMode ? null : ScrollBarHorizontal.html()}
          `
        )}
      </div>
    `
  );
}

function listTemplate({ className, styleMap, list, listColumns, actions, slots, html, cache, vido, props }) {
  const headerHeight = vido.state.get('config.headerHeight');
  const listWidth = vido.state.get('$data.list.width');
  return slots.html(
    'outer',
    cache(
      list.columns.percent > 0
        ? html`
            <div class=${className} data-actions=${actions()} style=${styleMap.directive()}>
              <div
                class="list-top-content"
                style="top: ${headerHeight}px;width:${listWidth}px;position:absolute;text-align:center;margin:auto;height:50px;"
              >
                top content?
              </div>
              ${slots.html(
                'content',
                listColumns.map((c) => c.html())
              )}
            </div>
            <div
              class="list-bottom-conent"
              style="bottom:0px;width:${listWidth}px;position:absolute;text-align:center;margin: auto;height:65px"
            >
              bottom content?
            </div>
          `
        : ''
    )
  );
}

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
      zoom: 19.4,
    },
  },
  additionalSpace: {
    top: 50,
    bottom: 65,
  },
  templates: {
    'chart-calendar': chartCalendarTemplate,
    chart: chartTemplate,
    list: listTemplate,
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
window.state = state;
//@ts-ignore
window.gstc = gstc;
