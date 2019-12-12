/**
 * DependencyLines plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

let opts: Options;
let state, api;
const container = document.createElement('div');
container.style.position = 'absolute';
container.style.left = '0';
container.style.top = '0';
container.style.width = 'var(--width)';
container.style.height = 'var(--height)';

export type Type = 'straight' | 'quadratic' | 'cubic';
export interface Style {
  [name: string]: string;
}
export interface Options {
  type?: Type;
  style?: Style;
  width?: number;
  height?: number;
}

const defaultOptions: Options = {
  type: 'quadratic',
  style: {},
  width: 16,
  height: 16
};

export interface Point {
  x: number;
  y: number;
}

export type Points = Point[];

/**
 * Item dependency line handle
 * @param vido
 * @param props
 */
function ItemDependencyLineHandle(vido, props) {
  const { html, onDestroy, api, state } = vido;
  const componentName = 'chart-timeline-dependency-lines-handle';

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  return templateProps =>
    html`
      <div class=${className}></div>
    `;
}

/**
 * Item dependency line component
 * @param vido
 * @param props
 */
function ItemDependencyLine(vido, props) {
  const { state, onDestroy, onChange, html, svg, Detach, update, StyleMap } = vido;
  const componentName = 'chart-timeline-dependency-lines-line';

  let classNameLine;
  onDestroy(
    state.subscribe('config.classNames', () => {
      classNameLine = api.getClass(componentName + '-line');
    })
  );

  let wrapper;
  onDestroy(
    state.subscribe('config.wrappers.DependencyLineRightHandle', value => {
      if (value) {
        wrapper = value;
      } else {
        wrapper = function DependencyLineRightHandleWrapper(input) {
          return input;
        };
      }
    })
  );

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  const styleMapHandle = new StyleMap({});
  const styleMapLine = new StyleMap({});

  let lines = [];
  function updateLines() {
    lines.length = 0;
    const itemIds = props?.item?.lines || [];
    const items = state.get('config.chart.items');
    const rows = state.get('config.list.rows');
    for (const itemId of itemIds) {
      const currentItem = items[itemId];
      if (!currentItem) continue;
      const currentRow = rows[currentItem.rowId];
      if (!currentRow) continue;
      const width = Math.abs(props.width + (props.item.time.start - currentItem.time.start) / timePerPixel);
      const height = Math.abs(props.row.top - currentRow.top) + currentRow.height;
      const line = svg`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>`;
      lines.push(line);
    }
  }

  let timePerPixel = 1;
  onDestroy(
    state.subscribe('_internal.chart.time.timePerPixel', value => {
      timePerPixel = value || 1;
      updateLines();
    })
  );

  onChange(function onChange(changedProps, options) {
    if (options.leave || !changedProps) {
      shouldDetach = true;
      return update();
    }
    shouldDetach = false;
    props = changedProps;
    styleMapHandle.style['left'] = props.left + props.width - opts.width + 'px';
    styleMapHandle.style['width'] = opts.width + 'px';
    styleMapHandle.style['height'] = opts.height + 'px';
    styleMapLine.style['left'] = props.left + props.width + 'px';
    updateLines();
    update();
  });

  return templateProps =>
    wrapper(
      html`
        <div detach=${detach} class=${classNameLine} style=${styleMapLine}>${lines.map(line => line)}</div>
      `,
      { templateProps, props, vido }
    );
}

/**
 * DependencyLines Lines Component
 * @param vido
 */
function DependencyLinesLines(vido) {
  const { html, onDestroy, api, state, reuseComponents } = vido;
  const componentName = 'chart-timeline-dependency-lines-lines';

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  let lines = [];
  onDestroy(
    state.subscribe('_internal.chart.visibleItems', visibleItems => {
      const allRows = state.get('config.list.rows');
      const rows = {};
      for (const itemId in visibleItems) {
        const item = visibleItems[itemId];
        if (typeof item.rowId === 'string' && allRows[item.rowId]) {
          rows[item.rowId] = allRows[item.rowId];
        }
      }
    })
  );

  return templateProps =>
    html`
      <div class="${className}">${lines.map(line => line.html())}</div>
    `;
}

/**
 * DependencyLines Handles Component
 * @param vido
 */
function DependencyLinesHandles(vido) {
  const { html, onDestroy, api, state, reuseComponents } = vido;
  const componentName = 'chart-timeline-dependency-lines-handles';

  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
    })
  );

  let handles = [];
  onDestroy(
    state.subscribe('config.chart.items', items => {
      const itemsArray = Object.values(items);
    })
  );

  return templateProps =>
    html`
      <div class="${className}">${handles.map(handle => handle.html())}</div>
    `;
}

export default function DependencyLinesPlugin(options: Options = defaultOptions) {
  opts = { ...defaultOptions, ...options };

  return function initialize(vido) {
    state = vido.state;
    api = vido.api;

    const Lines = vido.createComponent(DependencyLinesLines);
    state.update('config.wrappers.ChartTimelineGrid', gridWrapper => {
      return function DependencyLinesGridWrapper(input, data) {
        const output = vido.html`${input}${Lines.html()}`;
        return gridWrapper(output, data);
      };
    });

    const Handles = vido.createComponent(DependencyLinesHandles);
    state.update('config.wrappers.ChartTimelineItems', itemsWrapper => {
      return function DependencyLinesItemsWrapper(input, data) {
        const output = vido.html`${input}${Handles.html()}`;
        return itemsWrapper(output, data);
      };
    });

    return function destroy() {
      Lines.destroy();
      Handles.destroy();
    };
  };
}
