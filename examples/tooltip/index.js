import GSTC from '../../dist/gstc.wasm.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

//import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom';
// in your project you should use import statements above
// but for this example we will use globalThis (imppor from CDN inside html file)
// @ts-ignore
const floatingUI = window.FloatingUIDOM;

const rows = [
  {
    id: '1',
    label: 'Row 1',
  },
  {
    id: '2',
    label: 'Row 2',
  },
  {
    id: '3',
    label: 'Row 3',
  },
  {
    id: '4',
    label: 'Row 4',
  },
  {
    id: '5',
    label: 'Row 5',
  },
  {
    id: '6',
    label: 'Row 6',
  },
];

const items = [
  {
    id: '1',
    label: 'Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-06').endOf('day').valueOf(),
    },
  },
  {
    id: '2',
    label: 'Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-02-01').startOf('day').valueOf(),
      end: GSTC.api.date('2020-02-15').endOf('day').valueOf(),
    },
  },
  {
    id: '3',
    label: 'Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').valueOf(),
      end: GSTC.api.date('2020-01-20').endOf('day').valueOf(),
    },
  },
];

const columns = [
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

let gstc, state;

let disableTooltip = false;
/**
 * @type {import('../../dist/gstc').htmlResult | string}
 */
let tooltipContent = '';

// import { Component } from 'gantt-schedule-timeline-calendar';
/**
 * @type {import("../../dist/gstc").Component}
 */
function mainSlotWithTooltip(vido) {
  const { html } = vido;
  return (content) =>
    html`${content}
      <div id="tooltip" role="tooltip">
        ${tooltipContent}
        <div id="tooltip-arrow"></div>
      </div>
      <style>
        #tooltip {
          display: none;
          width: max-content;
          position: absolute;
          top: 0;
          left: 0;
          background: #222;
          color: white;
          font-weight: bold;
          padding: 5px;
          border-radius: 4px;
          font-size: 90%;
        }
        #tooltip-arrow {
          position: absolute;
          background: #222;
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
        }
      </style>`;
}

/**
 * Show tooltip with content
 * @param {import('../../dist/gstc').htmlResult | string} content to display
 */
async function showTooltip(element, content) {
  tooltipContent = content;
  if (disableTooltip) {
    hideTooltip();
    return;
  }
  // we need to refresh component to trigger slot update with our new content
  await gstc.component.update();

  const tooltip = document.getElementById('tooltip');
  const arrowElement = document.getElementById('tooltip-arrow');
  if (!tooltip || !arrowElement) return;
  tooltip.style.display = 'block';

  const { x, y, placement, middlewareData } = await floatingUI.computePosition(element, tooltip, {
    placement: 'top',
    middleware: [
      floatingUI.flip(),
      floatingUI.shift(),
      floatingUI.offset(6),
      floatingUI.arrow({ element: arrowElement }),
    ],
  });

  Object.assign(tooltip.style, {
    left: `${x}px`,
    top: `${y}px`,
    display: 'block',
  });

  const { x: arrowX, y: arrowY } = middlewareData.arrow;
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]];

  Object.assign(arrowElement.style, {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    right: '',
    bottom: '',
    [staticSide]: '-4px',
  });
  await gstc.component.update();
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// import { Action } from 'gantt-schedule-timeline-calendar';
/**
 * @type {import('../../dist/gstc').Action}
 */
function itemAction(element, data) {
  let itemTooltipContent = () =>
    GSTC.lithtml.html`<div>ID: ${GSTC.api.sourceID(data.item.id)}</div><div>Item: ${data.item.label}</div><div>Row: ${
      data.row.label
    }</div><div>From: ${data.itemData.time.startDate.format(
      'YYYY-MM-DD'
    )}</div><div>To: ${data.itemData.time.endDate.format('YYYY-MM-DD')}</div>`;

  const showTooltipEventListener = () => showTooltip(element, itemTooltipContent());
  const hideTooltipEventListener = () => hideTooltip();

  element.addEventListener('mouseenter', showTooltipEventListener);
  element.addEventListener('mousemove', showTooltipEventListener);
  element.addEventListener('mouseleave', hideTooltipEventListener);
  element.addEventListener('click', showTooltipEventListener);

  return {
    update(element, updatedData) {
      data = updatedData;
    },
    destroy(element, data) {
      hideTooltip();
      element.removeEventListener('mouseenter', showTooltipEventListener);
      element.removeEventListener('mousemove', showTooltipEventListener);
      element.removeEventListener('mouseleave', hideTooltipEventListener);
      element.removeEventListener('click', showTooltipEventListener);
    },
  };
}

// import { Action } from 'gantt-schedule-timeline-calendar';
/**
 * @type {import('../../dist/gstc').Action}
 */
function rowAction(element, data) {
  let itemTooltipContent = () =>
    GSTC.lithtml.html`<div>ID: ${GSTC.api.sourceID(data.row.id)}</div><div>Row: ${data.row.label}</div>`;

  const showTooltipEventListener = () => showTooltip(element, itemTooltipContent());
  const hideTooltipEventListener = () => hideTooltip();

  element.addEventListener('mouseenter', showTooltipEventListener);
  element.addEventListener('mouseleave', hideTooltipEventListener);
  element.addEventListener('click', showTooltipEventListener);

  return {
    update(element, updatedData) {
      data = updatedData;
    },
    destroy(element, data) {
      hideTooltip();
      element.removeEventListener('mouseenter', showTooltipEventListener);
      element.removeEventListener('mouseleave', hideTooltipEventListener);
      element.removeEventListener('click', showTooltipEventListener);
    },
  };
}

// import { Action } from 'gantt-schedule-timeline-calendar';
/**
 * @type {import('../../dist/gstc').Action}
 */
function dateAction(element, data) {
  let itemTooltipContent = () => GSTC.lithtml.html`<div>Date: ${data.date.leftGlobalDate.format('YYYY-MM-DD')}</div>`;

  const showTooltipEventListener = () => showTooltip(element, itemTooltipContent());
  const hideTooltipEventListener = () => hideTooltip();

  element.addEventListener('mouseenter', showTooltipEventListener);
  element.addEventListener('mouseleave', hideTooltipEventListener);
  element.addEventListener('click', showTooltipEventListener);

  return {
    update(element, updatedData) {
      data = updatedData;
    },
    destroy(element, data) {
      hideTooltip();
      element.removeEventListener('mouseenter', showTooltipEventListener);
      element.removeEventListener('mouseleave', hideTooltipEventListener);
      element.removeEventListener('click', showTooltipEventListener);
    },
  };
}

// Configuration object

// Typescript usage:
// import { Config } from 'gantt-schedule-timeline-calendar';
// const config: Config = {...};
/**
 * @type {import('../../dist/gstc').Config}  // or {import('gantt-schedule-timeline-calendar').Config}
 */
const config = {
  // for trial key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
  innerHeight: 100,
  plugins: [
    TimelinePointer(), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing({
      events: {
        onStart({ items }) {
          disableTooltip = true;
          hideTooltip();
          return items.after;
        },
        onEnd({ items }) {
          disableTooltip = false;
          return items.after;
        },
      },
    }), // resizing must fo before movement
    ItemMovement({
      events: {
        onStart({ items }) {
          disableTooltip = true;
          hideTooltip();
          return items.after;
        },
        onEnd({ items }) {
          disableTooltip = false;
          return items.after;
        },
      },
    }),
  ],
  list: {
    columns: {
      data: GSTC.api.fromArray(columns),
    },
    rows: GSTC.api.fromArray(rows),
  },
  chart: {
    items: GSTC.api.fromArray(items),
  },
  actions: {
    'chart-timeline-items-row-item': [itemAction],
    'list-column-row': [rowAction],
    'chart-calendar-date': [dateAction],
  },
  slots: {
    main: { outer: [mainSlotWithTooltip] },
  },
};

// Generate GSTC state from configuration object
state = GSTC.api.stateFromConfig(config);

const element = document.getElementById('gstc');
if (!element) throw new Error('Element not found');

// Mount the component
gstc = GSTC({
  element,
  state,
});

globalThis.gstc = gstc;
globalThis.state = state;
