/**
 * ItemMovement plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export interface Options {
  moveable?: boolean | string;
  resizeable?: boolean | string;
  resizerContent?: string;
  collisionDetection?: boolean;
  outOfBorders?: boolean;
  snapStart?: (timeStart: number, startDiff: number, item: object) => number;
  snapEnd?: (timeEnd: number, endDiff: number, item: object) => number;
  ghostNode?: boolean;
}

const pointerEventsExists = typeof PointerEvent !== 'undefined';

export default function ItemMovement(options: Options = {}) {
  const defaultOptions = {
    moveable: true,
    resizeable: true,
    resizerContent: '',
    collisionDetection: true,
    outOfBorders: false,
    snapStart(timeStart, startDiff) {
      return timeStart + startDiff;
    },
    snapEnd(timeEnd, endDiff) {
      return timeEnd + endDiff;
    },
    ghostNode: true
  };
  options = { ...defaultOptions, ...options };

  const movementState = {};

  /**
   * Add moving functionality to items as action
   *
   * @param {HTMLElement} element DOM Node
   * @param {Object} data
   */
  function action(element: HTMLElement, data) {
    if (!options.moveable && !options.resizeable) {
      return;
    }
    const state = data.state;
    const api = data.api;

    function isMoveable(data) {
      let moveable = options.moveable;
      if (data.item.hasOwnProperty('moveable') && moveable) {
        moveable = data.item.moveable;
      }
      if (data.row.hasOwnProperty('moveable') && moveable) {
        moveable = data.row.moveable;
      }
      return moveable;
    }

    function isResizeable(data) {
      let resizeable = options.resizeable && (!data.item.hasOwnProperty('resizeable') || data.item.resizeable === true);
      if (data.row.hasOwnProperty('resizeable') && resizeable) {
        resizeable = data.row.resizeable;
      }
      return resizeable;
    }

    function getMovement(data) {
      const itemId = data.item.id;
      if (typeof movementState[itemId] === 'undefined') {
        movementState[itemId] = { moving: false, resizing: false };
      }
      return movementState[itemId];
    }

    function createGhost(data, normalized, ganttLeft, ganttTop) {
      const movement = getMovement(data);
      if (!options.ghostNode || typeof movement.ghost !== 'undefined') {
        return;
      }
      const ghost = element.cloneNode(true) as HTMLElement;
      const style = getComputedStyle(element);
      const compensationY = state.get('config.scroll.compensation.y');
      ghost.style.position = 'absolute';
      ghost.style.left = normalized.clientX - ganttLeft - movement.itemLeftCompensation + 'px';
      const itemTop = normalized.clientY - ganttTop - element.offsetTop - compensationY + parseInt(style['margin-top']);
      movement.itemTop = itemTop;
      ghost.style.top = normalized.clientY - ganttTop - itemTop + 'px';
      ghost.style.width = style.width;
      ghost.style['box-shadow'] = '10px 10px 6px #00000020';
      const height = element.clientHeight + 'px';
      ghost.style.height = height;
      ghost.style['line-height'] = element.clientHeight - 18 + 'px';
      ghost.style.opacity = '0.6';
      ghost.style.transform = 'scale(1.05, 1.05)';
      state.get('_internal.elements.chart-timeline').appendChild(ghost);
      movement.ghost = ghost;
      return ghost;
    }

    function moveGhost(data, normalized) {
      if (options.ghostNode) {
        const movement = getMovement(data);
        const left = normalized.clientX - movement.ganttLeft - movement.itemLeftCompensation;
        movement.ghost.style.left = left + 'px';
        movement.ghost.style.top =
          normalized.clientY -
          movement.ganttTop -
          movement.itemTop +
          parseInt(getComputedStyle(element)['margin-top']) +
          'px';
      }
    }

    function destroyGhost(itemId) {
      if (!options.ghostNode) {
        return;
      }
      if (typeof movementState[itemId] !== 'undefined' && typeof movementState[itemId].ghost !== 'undefined') {
        state.get('_internal.elements.chart-timeline').removeChild(movementState[itemId].ghost);
        delete movementState[itemId].ghost;
      }
    }

    function getSnapStart(data) {
      let snapStart = options.snapStart;
      if (typeof data.item.snapStart === 'function') {
        snapStart = data.item.snapStart;
      }
      return snapStart;
    }

    function getSnapEnd(data) {
      let snapEnd = options.snapEnd;
      if (typeof data.item.snapEnd === 'function') {
        snapEnd = data.item.snapEnd;
      }
      return snapEnd;
    }

    const resizerHTML = `<div class="${api.getClass('chart-timeline-items-row-item-resizer')}">${
      options.resizerContent
    }</div>`;
    // @ts-ignore
    element.insertAdjacentHTML('beforeend', resizerHTML);
    const resizerEl: HTMLElement = element.querySelector(
      '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-resizer'
    );
    if (!isResizeable(data)) {
      resizerEl.style.visibility = 'hidden';
    } else {
      resizerEl.style.visibility = 'visible';
    }

    function labelDown(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      const normalized = api.normalizePointerEvent(ev);
      if ((ev.type === 'pointerdown' || ev.type === 'mousedown') && ev.button !== 0) {
        return;
      }
      const movement = getMovement(data);
      movement.moving = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.chart-timeline').getBoundingClientRect();
      movement.ganttTop = ganttRect.top;
      movement.ganttLeft = ganttRect.left;
      movement.itemX = Math.round((item.time.start - chartLeftTime) / timePerPixel);
      movement.itemLeftCompensation = normalized.clientX - movement.ganttLeft - movement.itemX;
      createGhost(data, normalized, ganttRect.left, ganttRect.top);
    }

    function resizerDown(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      if ((ev.type === 'pointerdown' || ev.type === 'mousedown') && ev.button !== 0) {
        return;
      }
      const normalized = api.normalizePointerEvent(ev);
      const movement = getMovement(data);
      movement.resizing = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.chart-timeline').getBoundingClientRect();
      movement.ganttTop = ganttRect.top;
      movement.ganttLeft = ganttRect.left;
      movement.itemX = (item.time.end - chartLeftTime) / timePerPixel;
      movement.itemLeftCompensation = normalized.clientX - movement.ganttLeft - movement.itemX;
    }

    function isCollision(rowId, itemId, start, end) {
      if (!options.collisionDetection) {
        return false;
      }
      const time = state.get('_internal.chart.time');
      if (options.outOfBorders && (start < time.from || end > time.to)) {
        return true;
      }
      let diff = api.time.date(end).diff(start, 'milliseconds');
      if (Math.sign(diff) === -1) {
        diff = -diff;
      }
      if (diff <= 1) {
        return true;
      }
      const row = state.get('config.list.rows.' + rowId);
      for (const rowItem of row._internal.items) {
        if (rowItem.id !== itemId) {
          if (start >= rowItem.time.start && start <= rowItem.time.end) {
            return true;
          }
          if (end >= rowItem.time.start && end <= rowItem.time.end) {
            return true;
          }
          if (start <= rowItem.time.start && end >= rowItem.time.end) {
            return true;
          }
        }
      }
      return false;
    }

    function movementX(normalized, row, item, zoom, timePerPixel) {
      const movement = getMovement(data);
      const left = normalized.clientX - movement.ganttLeft - movement.itemLeftCompensation;
      moveGhost(data, normalized);
      const leftMs = state.get('_internal.chart.time.leftGlobal') + left * timePerPixel;
      const add = leftMs - item.time.start;
      const originalStart = item.time.start;
      const finalStartTime = getSnapStart(data)(item.time.start, add, item);
      const finalAdd = finalStartTime - originalStart;
      const collision = isCollision(row.id, item.id, item.time.start + finalAdd, item.time.end + finalAdd);
      if (finalAdd && !collision) {
        state.update(`config.chart.items.${data.item.id}.time`, function moveItem(time) {
          time.start += finalAdd;
          time.end = getSnapEnd(data)(time.end, finalAdd, item) - 1;
          return time;
        });
      }
    }

    function resizeX(normalized, row, item, zoom, timePerPixel) {
      if (!isResizeable(data)) {
        return;
      }
      const time = state.get('_internal.chart.time');
      const movement = getMovement(data);
      const left = normalized.clientX - movement.ganttLeft - movement.itemLeftCompensation;
      const leftMs = time.leftGlobal + left * timePerPixel;
      const add = leftMs - item.time.end;
      if (item.time.end + add < item.time.start) {
        return;
      }
      const originalEnd = item.time.end;
      const finalEndTime = getSnapEnd(data)(item.time.end, add, item) - 1;
      const finalAdd = finalEndTime - originalEnd;
      const collision = isCollision(row.id, item.id, item.time.start, item.time.end + finalAdd);
      if (finalAdd && !collision) {
        state.update(`config.chart.items.${data.item.id}.time`, time => {
          time.start = getSnapStart(data)(time.start, 0, item);
          time.end = getSnapEnd(data)(time.end, finalAdd, item) - 1;
          return time;
        });
      }
    }

    function movementY(normalized, row, item, zoom, timePerPixel) {
      moveGhost(data, normalized);
      const movement = getMovement(data);
      const top = normalized.clientY - movement.ganttTop;
      const visibleRows = state.get('_internal.list.visibleRows');
      const compensationY = state.get('config.scroll.compensation.y');
      let index = 0;
      for (const currentRow of visibleRows) {
        if (currentRow.top + compensationY > top) {
          if (index > 0) {
            return index - 1;
          }
          return 0;
        }
        index++;
      }
      return index;
    }

    function documentMove(ev) {
      const movement = getMovement(data);
      const normalized = api.normalizePointerEvent(ev);
      let item, rowId, row, zoom, timePerPixel;
      if (movement.moving || movement.resizing) {
        ev.stopPropagation();
        ev.preventDefault();
        item = state.get(`config.chart.items.${data.item.id}`);
        rowId = state.get(`config.chart.items.${data.item.id}.rowId`);
        row = state.get(`config.list.rows.${rowId}`);
        zoom = state.get('config.chart.time.zoom');
        timePerPixel = state.get('_internal.chart.time.timePerPixel');
      }
      const moveable = isMoveable(data);
      if (movement.moving) {
        if (moveable === true || moveable === 'x' || (Array.isArray(moveable) && moveable.includes(rowId))) {
          movementX(normalized, row, item, zoom, timePerPixel);
        }
        if (!moveable || moveable === 'x') {
          return;
        }
        let visibleRowsIndex = movementY(normalized, row, item, zoom, timePerPixel);
        const visibleRows = state.get('_internal.list.visibleRows');
        if (typeof visibleRows[visibleRowsIndex] === 'undefined') {
          if (visibleRowsIndex > 0) {
            visibleRowsIndex = visibleRows.length - 1;
          } else if (visibleRowsIndex < 0) {
            visibleRowsIndex = 0;
          }
        }
        const newRow = visibleRows[visibleRowsIndex];
        const newRowId = newRow.id;
        const collision = isCollision(newRowId, item.id, item.time.start, item.time.end);
        if (newRowId !== item.rowId && !collision) {
          if (!Array.isArray(moveable) || moveable.includes(newRowId)) {
            if (!newRow.hasOwnProperty('moveable') || newRow.moveable) {
              state.update(`config.chart.items.${item.id}.rowId`, newRowId);
            }
          }
        }
      } else if (movement.resizing && (typeof item.resizeable === 'undefined' || item.resizeable === true)) {
        resizeX(normalized, row, item, zoom, timePerPixel);
      }
    }

    function documentUp(ev) {
      const movement = getMovement(data);
      if (movement.moving || movement.resizing) {
        ev.stopPropagation();
        ev.preventDefault();
      }
      movement.moving = false;
      movement.resizing = false;
      for (const itemId in movementState) {
        movementState[itemId].moving = false;
        movementState[itemId].resizing = false;
        destroyGhost(itemId);
      }
    }

    if (pointerEventsExists) {
      element.addEventListener('pointerdown', labelDown);
      resizerEl.addEventListener('pointerdown', resizerDown);
      document.addEventListener('pointermove', documentMove);
      document.addEventListener('pointerup', documentUp);
    } else {
      element.addEventListener('touchstart', labelDown);
      resizerEl.addEventListener('touchstart', resizerDown);
      document.addEventListener('touchmove', documentMove);
      document.addEventListener('touchend', documentUp);
      document.addEventListener('touchcancel', documentUp);
      element.addEventListener('mousedown', labelDown);
      resizerEl.addEventListener('mousedown', resizerDown);
      document.addEventListener('mousemove', documentMove);
      document.addEventListener('mouseup', documentUp);
    }

    return {
      update(node, changedData) {
        if (!isResizeable(changedData) && resizerEl.style.visibility === 'visible') {
          resizerEl.style.visibility = 'hidden';
        } else if (isResizeable(changedData) && resizerEl.style.visibility === 'hidden') {
          resizerEl.style.visibility = 'visible';
        }
        data = changedData;
      },
      destroy(node, data) {
        if (pointerEventsExists) {
          element.removeEventListener('pointerdown', labelDown);
          resizerEl.removeEventListener('pointerdown', resizerDown);
          document.removeEventListener('pointermove', documentMove);
          document.removeEventListener('pointerup', documentUp);
        } else {
          element.removeEventListener('mousedown', labelDown);
          resizerEl.removeEventListener('mousedown', resizerDown);
          document.removeEventListener('mousemove', documentMove);
          document.removeEventListener('mouseup', documentUp);
          element.removeEventListener('touchstart', labelDown);
          resizerEl.removeEventListener('touchstart', resizerDown);
          document.removeEventListener('touchmove', documentMove);
          document.removeEventListener('touchend', documentUp);
          document.removeEventListener('touchcancel', documentUp);
        }
        resizerEl.remove();
      }
    };
  }

  return function initialize(vido) {
    vido.state.update('config.actions.chart-timeline-items-row-item', actions => {
      actions.push(action);
      return actions;
    });
  };
}
