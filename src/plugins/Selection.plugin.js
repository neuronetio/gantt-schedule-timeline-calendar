/**
 * Selection plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import schedule from 'raf-schd';
export default function Selection(options = {}) {
  let vido, state, api;
  const defaultOptions = {
    grid: false,
    items: true,
    rows: false,
    horizontal: true,
    vertical: true,
    selecting() {},
    deselecting() {},
    selected() {},
    deselected() {}
  };
  options = { ...defaultOptions, ...options };
  let chartTimeline, top, left;
  let selecting = { fromX: -1, fromY: -1, toX: -1, toY: -1, startX: -1, startY: -1, selecting: false };
  const path = 'config.plugin.selection';
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
  if (options.rectStyle) {
    for (const styleProp in options.rectStyle) {
      rect.style[styleProp] = options.rectStyle[styleProp];
    }
  }

  /**
   * Rect selection action
   * @param {Element} element
   * @param {object|any} data
   * @returns {object} with update and destroy
   */
  function rectSelectionAction(element, data) {
    let previousSelect;
    chartTimeline = state.get('_internal.elements.chart-timeline');
    if (!chartTimeline.querySelector('.' + rectClassName)) {
      chartTimeline.insertAdjacentElement('beforeend', rect);
      const bounding = chartTimeline.getBoundingClientRect();
      left = bounding.left;
      top = bounding.top;
    }

    /**
     * Clear selection
     */
    function clearSelection() {
      state.update(path, {
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
      state.update('_internal.chart.grid.rowsWithBlocks', rowsWithBlocks => {
        for (const row of rowsWithBlocks) {
          for (const block of row.blocks) {
            block.selected = false;
            block.selecting = false;
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
      const result = {};
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
     * Mouse down event handler
     * @param {MouseEvent} ev
     */
    function mouseDown(ev) {
      if (ev.button !== 0) {
        return;
      }
      selecting.selecting = true;
      selecting.fromX = ev.x - left;
      selecting.fromY = ev.y - top;
      selecting.startX = selecting.fromX;
      selecting.startY = selecting.fromY;
      previousSelect = cloneSelection(state.get(path));
      clearSelection();
    }

    /**
     * Save and swap coordinates if needed
     * @param {MouseEvent} ev
     */
    function saveAndSwapIfNeeded(ev) {
      const currentX = ev.x - left;
      const currentY = ev.y - top;
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
    }

    /**
     * Is rectangle inside other rectangle ?
     * @param {DOMRect} boundingRect
     * @param {DOMRect} rectBoundingRect
     * @returns {boolean}
     */
    function isInside(boundingRect, rectBoundingRect) {
      let horizontal = false;
      let vertical = false;
      if (
        (boundingRect.left >= rectBoundingRect.left && boundingRect.left <= rectBoundingRect.right) ||
        (boundingRect.right >= rectBoundingRect.left && boundingRect.right <= rectBoundingRect.right) ||
        (boundingRect.left <= rectBoundingRect.left && boundingRect.right >= rectBoundingRect.right)
      ) {
        horizontal = true;
      }
      if (
        (boundingRect.top >= rectBoundingRect.top && boundingRect.top <= rectBoundingRect.bottom) ||
        (boundingRect.bottom >= rectBoundingRect.top && boundingRect.bottom <= rectBoundingRect.bottom) ||
        (boundingRect.top <= rectBoundingRect.top && boundingRect.bottom >= rectBoundingRect.bottom)
      ) {
        vertical = true;
      }
      return horizontal && vertical;
    }

    /**
     * Get selecting elements
     * @param {DOMRect} rectBoundingRect
     * @param {Element[]} elements
     * @param {string} type
     * @returns {string[]}
     */
    function getSelecting(rectBoundingRect, elements, type) {
      const selectingResult = [];
      const all = elements[type + 's'];
      const currentSelecting = state.get(`${path}.selecting.${type}s`);
      for (const element of all) {
        const boundingRect = element.getBoundingClientRect();
        if (isInside(boundingRect, rectBoundingRect)) {
          selectingResult.push(element.vido.id);
          if (!currentSelecting.includes(element.vido.id)) {
            options.selecting(element.vido, type);
          }
        } else {
          if (currentSelecting.includes(element.vido.id)) {
            options.deselecting(element.vido, type);
          }
        }
      }
      return selectingResult;
    }

    /**
     * Mouse move event handler
     * @param {MouseEvent} ev
     */
    function mouseMove(ev) {
      if (!selecting.selecting) {
        return;
      }
      if (ev.x - left === selecting.fromX || ev.y - top === selecting.fromY) {
        return;
      }
      ev.stopPropagation();
      saveAndSwapIfNeeded(ev);
      rect.style.left = selecting.fromX + 'px';
      rect.style.top = selecting.fromY + 'px';
      rect.style.visibility = 'visible';
      rect.style.width = selecting.toX - selecting.fromX + 'px';
      rect.style.height = selecting.toY - selecting.fromY + 'px';
      const rectBoundingRect = rect.getBoundingClientRect();
      const elements = state.get('_internal.elements');
      const selectingGridRowBlocks = getSelecting(rectBoundingRect, elements, 'chart-timeline-grid-row-block');
      state.update(`${path}.selecting`, {
        'chart-timeline-grid-rows': [],
        'chart-timeline-grid-row-blocks': selectingGridRowBlocks,
        'chart-timeline-items-rows': [],
        'chart-timeline-items-row-items': []
      });
      state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
        for (const row of rowsWithBlocks) {
          for (const block of row.blocks) {
            // @ts-ignore
            if (selectingGridRowBlocks.includes(block.id)) {
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
     * Mouse up event handler
     * @param {MouseEvent} ev
     */
    function mouseUp(ev) {
      if (selecting.selecting) {
        ev.stopPropagation();
      } else {
        return;
      }
      selecting.selecting = false;
      rect.style.visibility = 'hidden';
      const currentSelect = state.get(path);
      const select = {};
      state.update(path, value => {
        select.selected = { ...value.selecting };
        select.selecting = {
          'chart-timeline-grid-rows': [],
          'chart-timeline-grid-row-blocks': [],
          'chart-timeline-items-rows': [],
          'chart-timeline-items-row-items': []
        };
        return select;
      });
      const elements = state.get('_internal.elements');
      for (const element of elements['chart-timeline-grid-row-blocks']) {
        if (currentSelect.selecting['chart-timeline-grid-row-blocks'].includes(element.vido.id)) {
          options.deselecting(element.vido, 'chart-timeline-grid-row-block');
        }
      }
      state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
        for (const row of rowsWithBlocks) {
          for (const block of row.blocks) {
            if (currentSelect.selecting['chart-timeline-grid-row-blocks'].includes(block.id)) {
              if (typeof block.selected === 'undefined' || !block.selected) {
                options.selected(block, 'chart-timeline-grid-row-block');
              }
              block.selected = true;
            } else {
              if (previousSelect.selected['chart-timeline-grid-row-blocks'].includes(block.id)) {
                options.deselected(block, 'chart-timeline-grid-row-block');
              }
              block.selected = false;
            }
          }
        }
        return rowsWithBlocks;
      });
    }

    element.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', schedule(mouseMove));
    document.body.addEventListener('mouseup', mouseUp);
    return {
      update() {},
      destroy() {
        document.body.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('mousemove', mouseMove);
        element.removeEventListener('mousedown', mouseDown);
      }
    };
  }

  /**
   * Grid row block action
   * @param {Element} element
   * @param {object} data
   * @returns {object} with update and destroy functions
   */
  function gridBlockAction(element, data) {
    const classNameSelecting = api.getClass('chart-timeline-grid-row-block') + '--selecting';
    const classNameSelected = api.getClass('chart-timeline-grid-row-block') + '--selected';
    if (data.selecting) {
      element.classList.add(classNameSelecting);
    } else {
      element.classList.remove(classNameSelecting);
    }
    if (data.selected) {
      element.classList.add(classNameSelected);
    } else {
      element.classList.remove(classNameSelected);
    }
    return {
      update(element, data) {
        if (data.selecting) {
          element.classList.add(classNameSelecting);
        } else {
          element.classList.remove(classNameSelecting);
        }
        if (data.selected) {
          element.classList.add(classNameSelected);
        } else {
          element.classList.remove(classNameSelected);
        }
      },
      destroy(element, changedData) {
        element.classList.remove(classNameSelecting);
        element.classList.remove(classNameSelected);
      }
    };
  }

  /**
   * On block create handler
   * @param {object} block
   * @returns {object} block
   */
  function onBlockCreate(block) {
    const select = state.get('config.plugin.selection');
    if (select.selected['chart-timeline-grid-row-blocks'].find(id => id === block.id)) {
      block.selected = true;
    } else {
      block.selected = false;
    }
    return block;
  }

  return function initialize(mainVido) {
    vido = mainVido;
    state = vido.state;
    api = vido.api;
    if (typeof state.get(path) === 'undefined') {
      state.update(path, {
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
    state.update('config.actions.chart-timeline', actions => {
      actions.push(rectSelectionAction);
      return actions;
    });
    state.update('config.actions.chart-timeline-grid-row-block', actions => {
      actions.push(gridBlockAction);
      return actions;
    });
    state.update('config.chart.grid.block.onCreate', onCreate => {
      onCreate.push(onBlockCreate);
      return onCreate;
    });
  };
}
