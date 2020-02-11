/**
 * Selection plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import { Action } from '@neuronet.io/vido/vido.esm';

export interface RectStyle {
  [key: string]: any;
}

export interface Options {
  grid?: boolean;
  items?: boolean;
  rows?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  rectStyle?: RectStyle;
  selecting?: (data, type: string) => void;
  deselecting?: (data, type: string) => void;
  selected?: (data, type) => void;
  deselected?: (data, type) => void;
  canSelect?: (type, state, all) => any[];
  canDeselect?: (type, state, all) => any[];
  getApi?: (api: any) => void;
}

export interface Items {
  [key: string]: string[];
}

interface SelectingData {
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  startX?: number;
  startY?: number;
  startCell?: any;
  selecting?: boolean;
  selected?: Items;
}

export interface SelectState {
  selecting?: Items;
  selected?: Items;
}

export default function Selection(options: Options = {}) {
  let vido, state, api, schedule;
  const pluginPath = 'config.plugin.selection';
  const rectClassName = 'gantt-schedule-timeline-caledar__plugin-selection-rect';
  const rect = document.createElement('div');
  rect.classList.add(rectClassName);
  rect.style.visibility = 'hidden';
  rect.style.left = '0px';
  rect.style.top = '0px';
  rect.style.width = '0px';
  rect.style.height = '0px';
  rect.style.background = 'rgba(0, 119, 192, 0.2)';
  rect.style.border = '2px dashed rgba(0, 119, 192, 0.75)';
  rect.style.position = 'absolute';
  rect.style['user-select'] = 'none';
  rect.style['pointer-events'] = 'none';

  const defaultOptions: Options = {
    grid: false,
    items: true,
    rows: false,
    horizontal: true,
    vertical: true,
    rectStyle: {},
    selecting() {},
    deselecting() {},
    selected() {},
    deselected() {},
    canSelect(type, currently, all) {
      return currently;
    },
    canDeselect(type, currently, all) {
      return [];
    },
    getApi() {}
  };
  options = { ...defaultOptions, ...options } as Options;
  for (const styleProp in options.rectStyle) {
    rect.style[styleProp] = options.rectStyle[styleProp];
  }
  const selecting: SelectingData = {
    fromX: -1,
    fromY: -1,
    toX: -1,
    toY: -1,
    startX: -1,
    startY: -1,
    startCell: false,
    selecting: false
  };
  const selectionTypesIdGetters = {
    'chart-timeline-grid-row': props => props.row.id,
    'chart-timeline-grid-row-block': props => props.id,
    'chart-timeline-items-row': props => props.row.id,
    'chart-timeline-items-row-item': props => props.item.id
  };

  function getEmptyContainer() {
    return {
      'chart-timeline-grid-rows': [],
      'chart-timeline-grid-row-blocks': [],
      'chart-timeline-items-rows': [],
      'chart-timeline-items-row-items': []
    };
  }

  function markSelecting(nowSelecting, addToPrevious = false) {
    if (addToPrevious) {
      state.update(`${pluginPath}.selecting`, selecting => {
        for (const name in selecting) {
          nowSelecting[name].forEach(id => {
            if (!selecting[name].includes()) {
              selecting[name].push(id);
            }
          });
        }
        return selecting;
      });
    } else {
      state.update(`${pluginPath}.selecting`, nowSelecting);
    }
    state.update(
      'config.chart.items',
      function updateItems(items) {
        const now = nowSelecting['chart-timeline-items-row-items'];
        for (const itemId in items) {
          const item = items[itemId];
          if (now.includes(item.id)) {
            item.selecting = true;
          } else {
            item.selecting = false;
          }
        }
        return items;
      },
      { only: ['selecting'] }
    );

    state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
      const nowBlocks = nowSelecting['chart-timeline-grid-row-blocks'];
      const nowRows = nowSelecting['chart-timeline-grid-rows'];
      if (rowsWithBlocks)
        for (const row of rowsWithBlocks) {
          if (nowRows.includes(row.id)) {
            row.selecting = true;
          } else {
            row.selecting = false;
          }
          for (const block of row.blocks) {
            if (nowBlocks.includes(block.id)) {
              block.selecting = true;
            } else {
              block.selecting = false;
            }
          }
        }
      return rowsWithBlocks;
    });
  }

  /**
   * Clear selection
   * @param {boolean} clear
   */
  function clearSelection(clear = false, onlySelecting = false) {
    let selectingState;
    if (onlySelecting) {
      state.update(pluginPath, currently => {
        selectingState = {
          selecting: {
            'chart-timeline-grid-rows': [],
            'chart-timeline-grid-row-blocks': [],
            'chart-timeline-items-rows': [],
            'chart-timeline-items-row-items': []
          },
          selected: currently.selected
        };
        return selectingState;
      });
    } else {
      state.update(pluginPath, currently => {
        selectingState = {
          selecting: {
            'chart-timeline-grid-rows': [],
            'chart-timeline-grid-row-blocks': [],
            'chart-timeline-items-rows': [],
            'chart-timeline-items-row-items': []
          },
          selected: {
            'chart-timeline-grid-rows': clear
              ? []
              : options.canDeselect(
                  'chart-timeline-grid-rows',
                  currently.selected['chart-timeline-grid-rows'],
                  currently
                ),
            'chart-timeline-grid-row-blocks': clear
              ? []
              : options.canDeselect(
                  'chart-timeline-grid-row-blocks',
                  currently.selected['chart-timeline-grid-row-blocks'],
                  currently
                ),
            'chart-timeline-items-rows': clear
              ? []
              : options.canDeselect(
                  'chart-timeline-items-rows',
                  currently.selected['chart-timeline-items-rows'],
                  currently
                ),
            'chart-timeline-items-row-items': clear
              ? []
              : options.canDeselect(
                  'chart-timeline-items-row-items',
                  currently.selected['chart-timeline-items-row-items'],
                  currently
                )
          }
        };
        return selectingState;
      });
      state.update('_internal.chart.grid.rowsWithBlocks', function clearRowsWithBlocks(rowsWithBlocks) {
        if (rowsWithBlocks)
          for (const row of rowsWithBlocks) {
            for (const block of row.blocks) {
              block.selected = selectingState.selected['chart-timeline-grid-row-blocks'].includes(block.id);
              block.selecting = false;
            }
          }
        return rowsWithBlocks;
      });
      state.update('config.chart.items', items => {
        if (items) {
          for (const itemId in items) {
            const item = items[itemId];
            item.selected = selectingState.selected['chart-timeline-items-row-items'].includes(itemId);
            item.selecting = false;
          }
        }
        return items;
      });
    }
  }

  let previousSelect;
  function markSelected(addToPrevious = false) {
    selecting.selecting = false;
    rect.style.visibility = 'hidden';
    const currentSelect = cloneSelection(state.get(pluginPath));
    const select: SelectState = {};
    if (addToPrevious) {
      state.update(pluginPath, value => {
        const selected = { ...value.selecting };
        for (const name in value.selected) {
          for (const id of selected[name]) {
            if (!value.selected[name].includes(id)) {
              value.selected[name].push(id);
            }
          }
        }
        select.selected = { ...value.selected };
        select.selecting = getEmptyContainer() as Items;
        return select;
      });
    } else {
      state.update(pluginPath, value => {
        select.selected = { ...value.selecting };
        select.selecting = getEmptyContainer() as Items;
        return select;
      });
    }
    const elements = state.get('_internal.elements');
    for (const type in selectionTypesIdGetters) {
      if (elements[type + 's'])
        for (const element of elements[type + 's']) {
          if (currentSelect.selecting[type + 's'].includes(element.vido.id)) {
            options.deselecting(element.vido, type);
          }
        }
    }
    state.update('config.chart.items', function updateItems(items) {
      for (const itemId in items) {
        const item = items[itemId];
        if (currentSelect.selecting['chart-timeline-items-row-items'].includes(item.id)) {
          if (typeof item.selected === 'undefined' || !item.selected) {
            options.selected(item, 'chart-timeline-items-row-item');
          }
          item.selected = true;
        } else if (addToPrevious && previousSelect.selected['chart-timeline-items-row-items'].includes(item.id)) {
          item.selected = true;
        } else {
          if (currentSelect.selected['chart-timeline-items-row-items'].includes(item.id)) {
            options.deselected(item, 'chart-timeline-items-row-item');
          }
          item.selected = false;
        }
      }
      return items;
    });
    state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
      if (rowsWithBlocks)
        for (const row of rowsWithBlocks) {
          for (const block of row.blocks) {
            if (currentSelect.selecting['chart-timeline-grid-row-blocks'].includes(block.id)) {
              if (typeof block.selected === 'undefined' || !block.selected) {
                options.selected(block, 'chart-timeline-grid-row-block');
              }
              block.selected = true;
            } else if (addToPrevious && previousSelect.selected['chart-timeline-grid-row-blocks'].includes(block.id)) {
              block.selected = true;
            } else {
              if (currentSelect.selected['chart-timeline-grid-row-blocks'].includes(block.id)) {
                options.deselected(block, 'chart-timeline-grid-row-block');
              }
              block.selected = false;
            }
          }
        }
      return rowsWithBlocks;
    });
  }

  /**
   * Clone current selection state
   * @param {object} currentSelect
   * @returns {object} currentSelect cloned
   */
  function cloneSelection(currentSelect) {
    const result: SelectingData = {};
    result.selecting = { ...currentSelect.selecting };
    result.selecting['chart-timeline-grid-rows'] = currentSelect.selecting['chart-timeline-grid-rows'].slice();
    result.selecting['chart-timeline-grid-row-blocks'] = currentSelect.selecting[
      'chart-timeline-grid-row-blocks'
    ].slice();
    result.selecting['chart-timeline-items-rows'] = currentSelect.selecting['chart-timeline-items-rows'].slice();
    result.selecting['chart-timeline-items-row-items'] = currentSelect.selecting[
      'chart-timeline-items-row-items'
    ].slice();
    result.selected = { ...currentSelect.selected };
    result.selected['chart-timeline-grid-rows'] = currentSelect.selected['chart-timeline-grid-rows'].slice();
    result.selected['chart-timeline-grid-row-blocks'] = currentSelect.selected[
      'chart-timeline-grid-row-blocks'
    ].slice();
    result.selected['chart-timeline-items-rows'] = currentSelect.selected['chart-timeline-items-rows'].slice();
    result.selected['chart-timeline-items-row-items'] = currentSelect.selected[
      'chart-timeline-items-row-items'
    ].slice();
    return result;
  }

  /**
   * Selection action class
   */
  class SelectionAction extends Action {
    private chartTimeline: Element;
    private mouseDown: (ev: MouseEvent) => void;
    private mouseMove: (ev: MouseEvent) => void;
    private mouseUp: (ev: MouseEvent) => void;
    private left: number;
    private top: number;
    private unsub: () => void;

    /**
     * Selection action constructor
     * @param {Element} element
     * @param {object|any} data
     */
    constructor(element: Element, data: any) {
      super();
      const api = {} as any;
      api.clearSelection = clearSelection;

      this.unsub = data.state.subscribeAll(
        ['_internal.elements.chart-timeline', '_internal.chart.dimensions.width'],
        bulk => {
          const chartTimeline = state.get('_internal.elements.chart-timeline');
          if (chartTimeline === undefined) return;
          this.chartTimeline = chartTimeline;
          if (!this.chartTimeline.querySelector('.' + rectClassName)) {
            this.chartTimeline.insertAdjacentElement('beforeend', rect);
          }
          const bounding = this.chartTimeline.getBoundingClientRect();
          this.left = bounding.left;
          this.top = bounding.top;
        }
      );

      /**
       * Save and swap coordinates if needed
       * @param {MouseEvent} ev
       */
      const saveAndSwapIfNeeded = (ev: MouseEvent) => {
        const normalized = vido.api.normalizePointerEvent(ev);
        const currentX = normalized.x - this.left;
        const currentY = normalized.y - this.top;
        if (currentX <= selecting.startX) {
          selecting.fromX = currentX;
          selecting.toX = selecting.startX;
        } else {
          selecting.fromX = selecting.startX;
          selecting.toX = currentX;
        }
        if (currentY <= selecting.startY) {
          selecting.fromY = currentY;
          selecting.toY = selecting.startY;
        } else {
          selecting.fromY = selecting.startY;
          selecting.toY = currentY;
        }
      };

      /**
       * Is rectangle inside other rectangle ?
       * @param {DOMRect} boundingRect
       * @param {DOMRect} rectBoundingRect
       * @returns {boolean}
       */
      const isInside = (boundingRect: DOMRect, rectBoundingRect: DOMRect) => {
        let horizontal = false;
        let vertical = false;
        if (
          (boundingRect.left > rectBoundingRect.left && boundingRect.left < rectBoundingRect.right) ||
          (boundingRect.right > rectBoundingRect.left && boundingRect.right < rectBoundingRect.right) ||
          (boundingRect.left <= rectBoundingRect.left && boundingRect.right >= rectBoundingRect.right)
        ) {
          horizontal = true;
        }
        if (
          (boundingRect.top > rectBoundingRect.top && boundingRect.top < rectBoundingRect.bottom) ||
          (boundingRect.bottom > rectBoundingRect.top && boundingRect.bottom < rectBoundingRect.bottom) ||
          (boundingRect.top <= rectBoundingRect.top && boundingRect.bottom >= rectBoundingRect.bottom)
        ) {
          vertical = true;
        }
        return horizontal && vertical;
      };

      /**
       * Get selecting elements
       * @param {DOMRect} rectBoundingRect
       * @param {Element[]} elements
       * @param {string} type
       * @returns {string[]}
       */
      function getSelecting(rectBoundingRect: DOMRect, elements: Element[], type: string, getId: (any) => string) {
        const selectingResult = [];
        const currentlySelectingData = [];
        const all = elements[type + 's'];
        if (!all) return [];
        const currentAll = state.get(pluginPath);
        const currentSelecting = currentAll.selecting[type + 's'];
        for (const element of all) {
          const boundingRect = element.getBoundingClientRect();
          if (isInside(boundingRect, rectBoundingRect)) {
            currentlySelectingData.push(element.vido);
            const canSelect = options.canSelect(type, currentlySelectingData, currentAll);
            if (canSelect.includes(element.vido)) {
              if (!currentSelecting.includes(getId(element.vido))) {
                options.selecting(element.vido, type);
              }
              selectingResult.push(getId(element.vido));
            } else {
              currentlySelectingData.unshift();
            }
          } else {
            if (currentSelecting.includes(getId(element.vido))) {
              options.deselecting(element.vido, type);
            }
          }
        }
        return selectingResult;
      }

      function trackSelection(ev, virtually = false) {
        const movement = state.get('config.plugin.ItemMovement.movement');
        const moving = movement && (movement.moving || movement.waiting);
        if (!selecting.selecting || moving) {
          if (moving) {
            selecting.selecting = false;
          }
          return;
        }
        clearSelection(false, true);
        saveAndSwapIfNeeded(ev);
        rect.style.left = selecting.fromX + 'px';
        rect.style.top = selecting.fromY + 'px';
        rect.style.width = selecting.toX - selecting.fromX + 'px';
        rect.style.height = selecting.toY - selecting.fromY + 'px';
        if (!virtually) {
          rect.style.visibility = 'visible';
        }
        const rectBoundingRect = rect.getBoundingClientRect();
        const elements = state.get('_internal.elements');
        const nowSelecting = {};
        for (const type in selectionTypesIdGetters) {
          nowSelecting[type + 's'] = getSelecting(rectBoundingRect, elements, type, selectionTypesIdGetters[type]);
        }
        markSelecting(nowSelecting, ev.ctrlKey);
      }

      /**
       * End select
       * @param {Event} ev
       */
      const endSelect = ev => {
        if (selecting.selecting) {
          ev.stopPropagation();
          ev.preventDefault();
          const normalized = vido.api.normalizePointerEvent(ev);
          if (selecting.startX === normalized.x - this.left && selecting.startY === normalized.y - this.top) {
            selecting.selecting = false;
            rect.style.visibility = 'hidden';
            return;
          }
        } else {
          const itemClass = '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item';
          const isItem = !!(ev.target as Element).closest(itemClass);
          if (!isItem) {
            if (!ev.ctrlKey) clearSelection();
          } else {
            markSelected(ev.ctrlKey);
          }
          return;
        }
        markSelected(ev.ctrlKey);
      };

      /**
       * Mouse down event handler
       * @param {MouseEvent} ev
       */
      this.mouseDown = ev => {
        const movement = state.get('config.plugin.ItemMovement.movement');
        const moving = movement && movement.moving;
        if ((ev.type === 'mousedown' && ev.button !== 0) || moving) {
          return;
        }
        const normalized = vido.api.normalizePointerEvent(ev);
        selecting.selecting = true;
        selecting.fromX = normalized.x - this.left;
        selecting.fromY = normalized.y - this.top;
        selecting.startX = selecting.fromX;
        selecting.startY = selecting.fromY;
        previousSelect = cloneSelection(state.get(pluginPath));
        const itemClass = '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item';
        const isItem = !!(ev.target as Element).closest(itemClass);
        if (!isItem) {
          if (!ev.ctrlKey) clearSelection();
        }
      };

      /**
       * Mouse move event handler
       * @param {MouseEvent} ev
       */
      this.mouseMove = ev => {
        trackSelection(ev);
      };

      /**
       * Mouse up event handler
       * @param {MouseEvent} ev
       */
      this.mouseUp = ev => {
        if (selecting.selecting) {
          endSelect(ev);
        }
      };

      element.addEventListener('mousedown', this.mouseDown);
      element.addEventListener('touchstart', this.mouseDown);
      document.addEventListener('mousemove', this.mouseMove);
      document.addEventListener('touchmove', this.mouseMove);
      document.addEventListener('mouseup', this.mouseUp);
      document.addEventListener('touchend', this.mouseUp);
      options.getApi(api);
    }

    public destroy(element) {
      document.removeEventListener('mouseup', this.mouseUp);
      document.removeEventListener('touchend', this.mouseUp);
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('touchmove', this.mouseMove);
      element.removeEventListener('mousedown', this.mouseDown);
      element.removeEventListener('touchstart', this.mouseDown);
      this.unsub();
    }
  }

  /**
   * Update selection
   * @param {any} data
   * @param {HTMLElement} element
   * @param {boolean} selecting
   * @param {boolean} selected
   * @param {string} classNameSelecting
   * @param {string} classNameSelected
   */
  function updateSelection(
    element: HTMLElement,
    selecting: boolean,
    selected: boolean,
    classNameSelecting: string,
    classNameSelected: string
  ) {
    if (selecting && !element.classList.contains(classNameSelecting)) {
      element.classList.add(classNameSelecting);
    } else if (!selecting && element.classList.contains(classNameSelecting)) {
      element.classList.remove(classNameSelecting);
    }
    if (selected && !element.classList.contains(classNameSelected)) {
      element.classList.add(classNameSelected);
    } else if (!selected && element.classList.contains(classNameSelected)) {
      element.classList.remove(classNameSelected);
    }
  }

  /**
   * Grid row block action
   * @param {HTMLElement} element
   * @param {object} data
   * @returns {object} with update and destroy functions
   */
  class GridBlockAction extends Action {
    private classNameSelecting: string;
    private classNameSelected: string;

    constructor(element: HTMLElement, data: any) {
      super();
      this.classNameSelecting = api.getClass('chart-timeline-grid-row-block') + '--selecting';
      this.classNameSelected = api.getClass('chart-timeline-grid-row-block') + '--selected';
      updateSelection(element, data.selecting, data.selected, this.classNameSelecting, this.classNameSelected);
    }

    public update(element: HTMLElement, data: any) {
      updateSelection(element, data.selecting, data.selected, this.classNameSelecting, this.classNameSelected);
    }

    public destroy(element: Element, changedData: any) {
      element.classList.remove(this.classNameSelecting);
      element.classList.remove(this.classNameSelected);
    }
  }

  /**
   * Item action
   * @param {Element} element
   * @param {object} data
   * @returns {object} with update and destroy functions
   */
  class ItemAction extends Action {
    private classNameSelecting: string;
    private classNameSelected: string;
    private data: any;
    private element: HTMLElement;

    constructor(element: HTMLElement, data: any) {
      super();
      this.data = data;
      this.element = element;
      this.classNameSelecting = api.getClass('chart-timeline-items-row-item') + '--selecting';
      this.classNameSelected = api.getClass('chart-timeline-items-row-item') + '--selected';
      this.data = data;
      this.element = element;
      this.onPointerDown = this.onPointerDown.bind(this);
      element.addEventListener('mousedown', this.onPointerDown);
      element.addEventListener('touchstart', this.onPointerDown);
      updateSelection(
        element,
        data.item.selecting,
        data.item.selected,
        this.classNameSelecting,
        this.classNameSelected
      );
    }

    public onPointerDown(ev) {
      previousSelect = cloneSelection(state.get(pluginPath));
      selecting.selecting = true;
      this.data.item.selected = true;
      const container = getEmptyContainer();
      container['chart-timeline-items-row-items'].push(this.data.item.id);
      markSelecting(container);
      markSelected(ev.ctrlKey);
      updateSelection(
        this.element,
        this.data.item.selecting,
        this.data.item.selected,
        this.classNameSelecting,
        this.classNameSelected
      );
    }

    public update(element: HTMLElement, data: any) {
      updateSelection(
        element,
        data.item.selecting,
        data.item.selected,
        this.classNameSelecting,
        this.classNameSelected
      );
      this.data = data;
    }

    public destroy(element: HTMLElement, data: any) {
      element.classList.remove(this.classNameSelecting);
      element.classList.remove(this.classNameSelected);
      element.removeEventListener('mousedown', this.onPointerDown);
      element.removeEventListener('touchstart', this.onPointerDown);
    }
  }

  /**
   * On block create handler
   * @param {object} block
   * @returns {object} block
   */
  function onBlockCreate(block) {
    const selectedBlocks = state.get('config.plugin.selection.selected.chart-timeline-grid-row-blocks');
    for (const selectedBlock of selectedBlocks) {
      if (selectedBlock === block.id) {
        block.selected = true;
        return block;
      }
    }
    block.selected = false;
    block.selecting = false;
    return block;
  }

  return function initialize(mainVido) {
    vido = mainVido;
    state = vido.state;
    api = vido.api;
    schedule = vido.schedule;
    if (typeof state.get(pluginPath) === 'undefined') {
      state.update(pluginPath, {
        selecting: {
          'chart-timeline-grid-rows': [],
          'chart-timeline-grid-row-blocks': [],
          'chart-timeline-items-rows': [],
          'chart-timeline-items-row-items': []
        },
        selected: {
          'chart-timeline-grid-rows': [],
          'chart-timeline-grid-row-blocks': [],
          'chart-timeline-items-rows': [],
          'chart-timeline-items-row-items': []
        }
      });
    }
    state.update('config.chart.items', items => {
      if (items)
        for (const itemId in items) {
          const item = items[itemId];
          if (typeof item.selecting === 'undefined') {
            item.selecting = false;
          }
          if (typeof item.selected === 'undefined') {
            item.selected = false;
          }
        }
      return items;
    });
    state.update('config.actions.chart-timeline', actions => {
      actions.push(SelectionAction);
      return actions;
    });
    state.update('config.actions.chart-timeline-grid-row-block', actions => {
      actions.push(GridBlockAction);
      return actions;
    });
    state.update('config.actions.chart-timeline-items-row-item', actions => {
      actions.push(ItemAction);
      return actions;
    });
    state.update('config.chart.grid.block.onCreate', onCreate => {
      onCreate.push(onBlockCreate);
      return onCreate;
    });
  };
}
