/**
 * Api functions
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0
 */

import defaultConfigFn from '../default-config';
import TimeApi from './Time';
import State from 'deep-state-observer';
import dayjs from 'dayjs';
import { Config, Period, ChartInternalTime } from '../types';
import { mergeDeep } from '@neuronet.io/vido/helpers';
const lib = 'gantt-schedule-timeline-calendar';

function mergeActions(userConfig, defaultConfig) {
  const defaultConfigActions = mergeDeep({}, defaultConfig.actions);
  const userActions = mergeDeep({}, userConfig.actions);
  let allActionNames = [...Object.keys(defaultConfigActions), ...Object.keys(userActions)];
  allActionNames = allActionNames.filter(i => allActionNames.includes(i));
  const actions = {};
  for (const actionName of allActionNames) {
    actions[actionName] = [];
    if (typeof defaultConfigActions[actionName] !== 'undefined' && Array.isArray(defaultConfigActions[actionName])) {
      actions[actionName] = [...defaultConfigActions[actionName]];
    }
    if (typeof userActions[actionName] !== 'undefined' && Array.isArray(userActions[actionName])) {
      actions[actionName] = [...actions[actionName], ...userActions[actionName]];
    }
  }
  delete userConfig.actions;
  delete defaultConfig.actions;
  return actions;
}

export function stateFromConfig(userConfig: Config) {
  const defaultConfig: Config = defaultConfigFn();
  const actions = mergeActions(userConfig, defaultConfig);
  const state = { config: mergeDeep({}, defaultConfig, userConfig) };
  state.config.actions = actions;
  // @ts-ignore
  return (this.state = new State(state, { delimeter: '.' }));
}

const publicApi = {
  name: lib,
  stateFromConfig,
  mergeDeep,
  date(time) {
    return time ? dayjs(time) : dayjs();
  },
  setPeriod(period: Period): number {
    this.state.update('config.chart.time.period', period);
    return this.state.get('config.chart.time.zoom');
  },
  dayjs
};
export default publicApi;

export function getInternalApi(state) {
  let $state = state.get();
  let unsubscribes = [];
  let vido;
  const iconsCache = {};
  const api = {
    name: lib,
    debug: false,

    setVido(Vido) {
      vido = Vido;
    },

    log(...args) {
      if (this.debug) {
        console.log.call(console, ...args);
      }
    },

    mergeDeep,

    getClass(name) {
      let simple = `${lib}__${name}`;
      if (name === this.name) {
        simple = this.name;
      }
      return simple;
    },

    allActions: [],

    getActions(name) {
      if (!this.allActions.includes(name)) this.allActions.push(name);
      let actions = state.get('config.actions.' + name);
      if (typeof actions === 'undefined') {
        actions = [];
      }
      return actions.slice();
    },

    isItemInViewport(item, left, right) {
      return (
        (item.time.start >= left && item.time.start < right) ||
        (item.time.end >= left && item.time.end < right) ||
        (item.time.start <= left && item.time.end >= right)
      );
    },

    prepareItems(items) {
      for (const item of items) {
        item.time.start = +item.time.start;
        item.time.end = +item.time.end;
        item.id = String(item.id);
      }
      return items;
    },

    fillEmptyRowValues(rows) {
      let top = 0;
      for (const rowId in rows) {
        const row = rows[rowId];
        row._internal = {
          parents: [],
          children: [],
          items: []
        };
        if (typeof row.height !== 'number') {
          row.height = $state.config.list.rowHeight;
        }
        if (typeof row.expanded !== 'boolean') {
          row.expanded = false;
        }
        row.top = top;
        top += row.height;
      }
      return rows;
    },

    generateParents(rows, parentName = 'parentId') {
      const parents = {};
      for (const row of rows) {
        const parentId = row[parentName] !== undefined && row[parentName] !== null ? row[parentName] : '';
        if (parents[parentId] === undefined) {
          parents[parentId] = {};
        }
        parents[parentId][row.id] = row;
      }
      return parents;
    },

    fastTree(rowParents, node, parents = []) {
      const children = rowParents[node.id];
      node._internal.parents = parents;
      if (typeof children === 'undefined') {
        node._internal.children = [];
        return node;
      }
      if (node.id !== '') {
        parents = [...parents, node.id];
      }
      node._internal.children = Object.values(children);
      for (const childrenId in children) {
        const child = children[childrenId];
        this.fastTree(rowParents, child, parents);
      }
      return node;
    },

    makeTreeMap(rows, items) {
      const itemParents = this.generateParents(items, 'rowId');
      for (const row of rows) {
        row._internal.items = itemParents[row.id] !== undefined ? Object.values(itemParents[row.id]) : [];
      }
      const rowParents = this.generateParents(rows);
      const tree = { id: '', _internal: { children: [], parents: [], items: [] } };
      return this.fastTree(rowParents, tree);
    },

    getFlatTreeMapById(treeMap, flatTreeMapById = {}) {
      for (const child of treeMap._internal.children) {
        flatTreeMapById[child.id] = child;
        this.getFlatTreeMapById(child, flatTreeMapById);
      }
      return flatTreeMapById;
    },

    flattenTreeMap(treeMap, rows = []) {
      for (const child of treeMap._internal.children) {
        rows.push(child.id);
        this.flattenTreeMap(child, rows);
      }
      return rows;
    },

    getRowsFromMap(flatTreeMap, rows) {
      return flatTreeMap.map(node => rows[node.id]);
    },

    getRowsFromIds(ids, rows) {
      const result = [];
      for (const id of ids) {
        result.push(rows[id]);
      }
      return result;
    },

    getRowsWithParentsExpanded(flatTreeMap, flatTreeMapById, rows) {
      if (
        !flatTreeMap ||
        !flatTreeMapById ||
        !rows ||
        flatTreeMap.length === 0 ||
        flatTreeMapById.length === 0 ||
        Object.keys(rows).length === 0
      ) {
        return [];
      }
      const rowsWithParentsExpanded = [];
      next: for (const rowId of flatTreeMap) {
        for (const parentId of flatTreeMapById[rowId]._internal.parents) {
          const parent = rows[parentId];
          if (!parent || !parent.expanded) {
            continue next;
          }
        }
        rowsWithParentsExpanded.push(rowId);
      }
      return rowsWithParentsExpanded;
    },

    getRowsHeight(rows) {
      let height = 0;
      for (const row of rows) {
        if (row) height += row.height;
      }
      return height;
    },

    /**
     * Get visible rows - get rows that are inside current viewport (height)
     *
     * @param {array} rowsWithParentsExpanded rows that have parent expanded- they are visible
     */
    getVisibleRowsAndCompensation(rowsWithParentsExpanded) {
      const visibleRows = [];
      let currentRowsOffset = 0;
      let rowOffset = 0;
      const scrollTop = state.get('config.scroll.top');
      const height = state.get('_internal.height');
      let chartViewBottom = 0;
      let compensation = 0;
      for (const row of rowsWithParentsExpanded) {
        if (row === undefined) continue;
        chartViewBottom = scrollTop + height;
        if (currentRowsOffset + row.height >= scrollTop && currentRowsOffset <= chartViewBottom) {
          row.top = rowOffset;
          compensation = row.top + scrollTop - currentRowsOffset;
          rowOffset += row.height;
          visibleRows.push(row);
        }
        currentRowsOffset += row.height;
        if (currentRowsOffset >= chartViewBottom) {
          break;
        }
      }
      return { visibleRows, compensation };
    },

    /**
     * Normalize mouse wheel event to get proper scroll metrics
     *
     * @param {Event} event mouse wheel event
     */
    normalizeMouseWheelEvent(event) {
      // @ts-ignore
      let x = event.deltaX || 0;
      // @ts-ignore
      let y = event.deltaY || 0;
      // @ts-ignore
      let z = event.deltaZ || 0;
      // @ts-ignore
      const mode = event.deltaMode;
      const lineHeight = state.get('config.list.rowHeight');
      let scale = 1;
      switch (mode) {
        case 1:
          if (lineHeight) {
            scale = lineHeight;
          }
          break;
        case 2:
          // @ts-ignore
          scale = window.height;
          break;
      }
      x *= scale;
      y *= scale;
      z *= scale;
      return { x, y, z, event };
    },

    normalizePointerEvent(event) {
      const result = { x: 0, y: 0, pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 };
      switch (event.type) {
        case 'wheel':
          const wheel = this.normalizeMouseWheelEvent(event);
          result.x = wheel.x;
          result.y = wheel.y;
          result.pageX = result.x;
          result.pageY = result.y;
          result.screenX = result.x;
          result.screenY = result.y;
          result.clientX = result.x;
          result.clientY = result.y;
          break;
        case 'touchstart':
        case 'touchmove':
        case 'touchend':
        case 'touchcancel':
          result.x = event.changedTouches[0].screenX;
          result.y = event.changedTouches[0].screenY;
          result.pageX = event.changedTouches[0].pageX;
          result.pageY = event.changedTouches[0].pageY;
          result.screenX = event.changedTouches[0].screenX;
          result.screenY = event.changedTouches[0].screenY;
          result.clientX = event.changedTouches[0].clientX;
          result.clientY = event.changedTouches[0].clientY;
          break;
        default:
          result.x = event.x;
          result.y = event.y;
          result.pageX = event.pageX;
          result.pageY = event.pageY;
          result.screenX = event.screenX;
          result.screenY = event.screenY;
          result.clientX = event.clientX;
          result.clientY = event.clientY;
          break;
      }
      return result;
    },

    limitScroll(which, scroll) {
      if (which === 'top') {
        const height = state.get('_internal.list.rowsHeight') - state.get('_internal.height');
        if (scroll < 0) {
          scroll = 0;
        } else if (scroll > height) {
          scroll = height;
        }
        return Math.round(scroll);
      } else {
        const width =
          state.get('_internal.chart.time.totalViewDurationPx') - state.get('_internal.chart.dimensions.width');
        if (scroll < 0) {
          scroll = 0;
        } else if (scroll > width) {
          scroll = width;
        }
        return Math.round(scroll);
      }
    },

    time: new TimeApi(state),

    /**
     * Get scrollbar height - compute it from element
     *
     * @returns {number}
     */
    getScrollBarHeight(add = 0) {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.height = '100px';
      document.body.appendChild(outer);
      const noScroll = outer.offsetHeight;
      outer.style.msOverflowStyle = 'scrollbar';
      outer.style.overflow = 'scroll';
      const inner = document.createElement('div');
      inner.style.height = '100%';
      outer.appendChild(inner);
      const withScroll = inner.offsetHeight;
      outer.parentNode.removeChild(outer);
      return noScroll - withScroll + add;
    },

    scrollToTime(toTime: number) {
      const time = state.get('_internal.chart.time');
      state.update('config.scroll', scroll => {
        const chartWidth = state.get('_internal.chart.dimensions.width');
        const halfTime = (chartWidth / 2) * time.timePerPixel;
        const leftGlobal = toTime - halfTime - time.from;
        scroll.left = this.limitScroll('left', Math.round(leftGlobal / time.timePerPixel));
        return scroll;
      });
    },

    recenterScroll() {},

    /**
     * Get grid blocks that are under specified rectangle
     *
     * @param {number} x beginging at chart-timeline bounding rect
     * @param {number} y beginging at chart-timeline bounding rect
     * @param {number} width
     * @param {number} height
     * @returns {array} array of {element, data}
     */
    getGridBlocksUnderRect(x, y, width, height) {
      const main = state.get('_internal.elements.main');
      if (!main) return [];
    },

    getCompensationX() {
      return state.get('config.scroll.compensation.x') || 0;
    },

    getCompensationY() {
      return state.get('config.scroll.compensation.y') || 0;
    },

    getSVGIconSrc(svg) {
      if (typeof iconsCache[svg] === 'string') return iconsCache[svg];
      iconsCache[svg] = 'data:image/svg+xml;base64,' + btoa(svg);
      return iconsCache[svg];
    },

    /**
     * Destroy things to release memory
     */
    destroy() {
      $state = undefined;
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      unsubscribes = [];
      if (api.debug) {
        // @ts-ignore
        delete window.state;
      }
    }
  };

  if (api.debug) {
    // @ts-ignore
    window.state = state;
    // @ts-ignore
    window.api = api;
  }

  return api;
}
