/**
 * Api functions
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import defaultConfigFn from '../default-config';
import timeApi from './Time';
import State from 'deep-state-observer';
import dayjs from 'dayjs';
const lib = 'gantt-schedule-timeline-calendar';

/**
 * Helper function to determine if specified variable is an object
 *
 * @param {any} item
 *
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Helper function which will merge objects recursively - creating brand new one - like clone
 *
 * @param {object} target
 * @params {object} sources
 *
 * @returns {object}
 */
export function mergeDeep(target, ...sources) {
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (typeof target[key] === 'undefined') {
          target[key] = {};
        }
        target[key] = mergeDeep(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        target[key] = [];
        for (let item of source[key]) {
          if (isObject(item)) {
            target[key].push(mergeDeep({}, item));
            continue;
          }
          target[key].push(item);
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  if (!sources.length) {
    return target;
  }
  return mergeDeep(target, ...sources);
}

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

export function stateFromConfig(userConfig) {
  const defaultConfig = defaultConfigFn();
  const actions = mergeActions(userConfig, defaultConfig);
  const state = { config: mergeDeep({}, defaultConfig, userConfig) };
  state.config.actions = actions;
  // @ts-ignore
  return new State(state, { delimeter: '.' });
}

const publicApi = {
  name: lib,
  stateFromConfig,
  mergeDeep,
  date(time) {
    return time ? dayjs(time) : dayjs();
  },
  dayjs
};
export default publicApi;

export function getInternalApi(state) {
  let $state = state.get();
  let unsubscribers = [];
  const api = {
    name: lib,
    debug: false,

    log(...args) {
      if (this.debug) {
        console.log.call(console, ...args);
      }
    },

    mergeDeep,

    getComponentData(componentName, attrs) {
      const componentData = {};
      componentData.componentName = componentName;
      componentData.className = this.getClass(componentName, attrs);
      componentData.action = this.getAction(componentName);
      return componentData;
    },

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
      return actions;
    },

    isItemInViewport(item, left, right) {
      return (item.time.start >= left && item.time.start < right) || (item.time.end >= left && item.time.end < right);
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
        const parentId = typeof row[parentName] !== 'undefined' ? row[parentName] : '';
        if (typeof parents[parentId] === 'undefined') {
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
        row._internal.items = typeof itemParents[row.id] !== 'undefined' ? Object.values(itemParents[row.id]) : [];
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
      const rowsWithParentsExpanded = [];
      next: for (const rowId of flatTreeMap) {
        for (const parentId of flatTreeMapById[rowId]._internal.parents) {
          const parent = rows[parentId];
          if (!parent.expanded) {
            continue next;
          }
        }
        rowsWithParentsExpanded.push(rowId);
      }
      return rowsWithParentsExpanded;
    },

    getRowsHeight(rows) {
      let height = 0;
      for (let row of rows) {
        height += row.height;
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
      let currentChartOffset = 0;
      let rowOffset = 0;
      const scrollTop = state.get('config.scroll.top');
      const height = state.get('_internal.height');
      let chartViewBottom = 0;
      let compensation = 0;
      for (const row of rowsWithParentsExpanded) {
        chartViewBottom = scrollTop + height;
        if (currentChartOffset + row.height > scrollTop && currentChartOffset < chartViewBottom) {
          row.top = rowOffset;
          compensation = row.top + scrollTop - currentChartOffset;
          rowOffset += row.height;
          visibleRows.push(row);
        }
        currentChartOffset += row.height;
        if (currentChartOffset >= chartViewBottom) {
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
      // @ts-ignore
      const lineHeight = parseInt(getComputedStyle(event.target).getPropertyValue('line-height'));
      let scale = 1;
      switch (mode) {
        case 1:
          scale = lineHeight;
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

    limitScroll(which, scroll) {
      if (which === 'top') {
        const height = state.get('_internal.list.rowsHeight') - state.get('_internal.height');
        if (scroll < 0) {
          scroll = 0;
        } else if (scroll > height) {
          scroll = height;
        }
        return scroll;
      } else {
        const width =
          state.get('_internal.chart.time.totalViewDurationPx') - state.get('_internal.chart.dimensions.width');
        if (scroll < 0) {
          scroll = 0;
        } else if (scroll > width) {
          scroll = width;
        }
        return scroll;
      }
    },

    time: timeApi(state, () => api),

    /**
     * Get scrollbar height - compute it from element
     *
     * @returns {number}
     */
    getScrollBarHeight() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.height = '100px';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      var noScroll = outer.offsetHeight;
      outer.style.overflow = 'scroll';
      var inner = document.createElement('div');
      inner.style.height = '100%';
      outer.appendChild(inner);
      var withScroll = inner.offsetHeight;
      outer.parentNode.removeChild(outer);
      return noScroll - withScroll + 1; // +1 for scroll area inside scroll container
    },

    /**
     * Destroy things to release memory
     */
    destroy() {
      $state = undefined;
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
      unsubscribers = [];
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
