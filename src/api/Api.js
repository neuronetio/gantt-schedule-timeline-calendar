// @ts-nocheck
import defaultConfig from '../default-config.ts';
import timeApi from './Time';
import State from 'deep-state-observer';
import dayjs from 'dayjs';
const lib = 'gantt-shedule-timeline-calendar';
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

function mergeActions(userConfig) {
  const defaultConfigActions = mergeDeep({}, defaultConfig.actions);
  const userActions = mergeDeep({}, userConfig.actions);
  const allActionNames = [Object.keys(defaultConfigActions), Object.keys(userActions)].flatMap((item, index, all) => {
    if (index === 1) {
      return item.filter(i => !all[0].includes(i));
    }
    return item;
  });
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
  const actions = mergeActions(userConfig);
  const state = { config: mergeDeep({}, defaultConfig, userConfig) };
  state.config.actions = actions;
  return new State(state, { delimeter: '.' });
}

const publicApi = {
  name: lib,
  stateFromConfig,
  mergeDeep,
  date(time) {
    return time ? dayjs(time).utc() : dayjs().utc();
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

    getClass(name, attrs) {
      let simple = `${lib}__${name}`;
      if (name === this.name) {
        simple = this.name;
      }
      let className = `${simple} `;
      let postfix = '-';
      if (typeof attrs !== 'undefined') {
        for (const key in attrs) {
          if (attrs[key].constructor.name === 'Object' && typeof attrs[key].id !== 'undefined') {
            postfix += `-${key}_${attrs[key].id}`;
            return className + className.trim() + postfix;
          }
          if (typeof attrs[key] === 'string' || typeof attrs[key] === 'number') {
            postfix += `-${key}_${attrs[key]}`;
          }
        }
      }
      if (postfix != '-') {
        className += simple + postfix + ' ';
      }
      if (typeof $state.config.classNames[name] !== 'undefined') {
        state.get(`config.classNames.${name}`).forEach(customClass => (className += customClass + ' '));
      }
      if (typeof $state.config.classNames[name + postfix] !== 'undefined') {
        state.get(`config.classNames.${name + postfix}`).forEach(customClass => (className += customClass + ' '));
      }
      return className.trim();
    },

    actionsExecutor(node, data) {
      const name = this.name;
      const actionResults = [];
      for (const action of $state.config.actions[name]) {
        actionResults.push(action(node, data));
      }
      return {
        update(data) {
          for (const result of actionResults) {
            if (result && typeof result.update === 'function') {
              result.update(data);
            }
          }
        },
        destroy() {
          for (const result of actionResults) {
            if (result && typeof result.destroy === 'function') {
              result.destroy();
            }
          }
        }
      };
    },

    allActions: [],

    getAction(name) {
      if (!this.allActions.includes(name)) this.allActions.push(name);
      if (typeof $state.config.actions[name] === 'undefined') {
        return () => {};
      }
      return this.actionsExecutor.bind({ name });
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
    getVisibleRows(rowsWithParentsExpanded) {
      const rows = [];
      let currentOffset = 0;
      let rowOffset = 0;
      for (const row of rowsWithParentsExpanded) {
        if (
          currentOffset + row.height > $state.config.scroll.top &&
          currentOffset < $state.config.scroll.top + $state._internal.height
        ) {
          row.top = rowOffset;
          rowOffset += row.height;
          rows.push(row);
        }
        if (currentOffset > $state.config.scroll.top + $state._internal.height) {
          break;
        }
        currentOffset += row.height;
      }
      return rows;
    },

    /**
     * Normalize mouse wheel event to get proper scroll metrics
     *
     * @param {Event} event mouse wheel event
     */
    normalizeMouseWheelEvent(event) {
      let x = event.deltaX || 0;
      let y = event.deltaY || 0;
      let z = event.deltaZ || 0;
      const mode = event.deltaMode;
      const lineHeight = parseInt(getComputedStyle(event.target).getPropertyValue('line-height'));
      let scale = 1;
      switch (mode) {
        case 1:
          scale = lineHeight;
          break;
        case 2:
          scale = window.height;
          break;
      }
      x *= scale;
      y *= scale;
      z *= scale;
      return { x, y, z };
    },

    limitScroll(which, scroll) {
      if (which === 'top') {
        const height = state.get('_internal.list.expandedHeight') - state.get('_internal.height');
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
        delete window.state;
      }
    }
  };

  if (api.debug) {
    window.state = state;
    window.api = api;
  }

  return api;
}
