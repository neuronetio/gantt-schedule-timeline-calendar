(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ItemMovement = factory());
}(this, (function () { 'use strict';

  /**
   * ItemMovement plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */

  function ItemMovement(options = {}) {
    const defaultOptions = {
      moveable: true,
      resizeable: true,
      resizerContent: '',
      collisionDetection: true,
      outOfBorders: false,
      snapStart: (timeStart, startDiff) => timeStart + startDiff,
      snapEnd: (timeEnd, endDiff) => timeEnd + endDiff,
      ghostNode: true
    };
    options = { ...defaultOptions, ...options };

    const movementState = {};

    /**
     * Add moving functionality to items as action
     *
     * @param {Node} node DOM Node
     * @param {Object} data
     */
    function action(node, data) {
      // @ts-ignore
      let element = node.querySelector('.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-content');
      if (!options.moveable && !options.resizeable) {
        return;
      }
      let state;
      let api;

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

      function createGhost(data, ev, ganttLeft, ganttTop) {
        const movement = getMovement(data);
        if (!options.ghostNode || typeof movement.ghost !== 'undefined') {
          return;
        }
        const ghost = element.cloneNode(true);
        const style = getComputedStyle(element);
        ghost.style.position = 'absolute';
        ghost.style.left = ev.x - ganttLeft - movement.itemLeftCompensation + 'px';
        const itemTop = ev.y - ganttTop - data.row.top - element.offsetTop;
        movement.itemTop = itemTop;
        ghost.style.top = ev.y - ganttTop - itemTop + 'px';
        ghost.style.width = style.width;
        ghost.style['box-shadow'] = '10px 10px 6px #00000020';
        const height = element.clientHeight + 'px';
        ghost.style.height = height;
        ghost.style['line-height'] = height;
        ghost.style.opacity = '0.75';
        state.get('_internal.elements.chart-timeline').appendChild(ghost);
        movement.ghost = ghost;
        return ghost;
      }

      function moveGhost(data, ev) {
        if (options.ghostNode) {
          const movement = getMovement(data);
          const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
          const compensation = state.get('config.scroll.compensation');
          movement.ghost.style.left = left + 'px';
          movement.ghost.style.top = ev.y - movement.ganttTop - movement.itemTop + compensation + 'px';
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
        element.style.opacity = '1';
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

      state = data.state;
      api = data.api;

      const resizerHTML = `<div class="${api.getClass('chart-timeline-items-row-item-content-resizer')}">${
      options.resizerContent
    }</div>`;
      // @ts-ignore
      element.insertAdjacentHTML('beforeend', resizerHTML);
      const resizerEl = element.querySelector(
        '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-content-resizer'
      );
      if (!isResizeable(data)) {
        resizerEl.style.visibility = 'hidden';
      } else {
        resizerEl.style.visibility = 'visible';
      }

      function labelMouseDown(ev) {
        ev.stopPropagation();
        if (ev.button !== 0) {
          return;
        }
        // @ts-ignore
        element = node.querySelector('.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-content');
        const movement = getMovement(data);
        movement.moving = true;
        const item = state.get(`config.chart.items.${data.item.id}`);
        const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
        const timePerPixel = state.get('_internal.chart.time.timePerPixel');
        const ganttRect = state.get('_internal.elements.chart-timeline').getBoundingClientRect();
        movement.ganttTop = ganttRect.top;
        movement.ganttLeft = ganttRect.left;
        movement.itemX = Math.round((item.time.start - chartLeftTime) / timePerPixel);
        movement.itemLeftCompensation = ev.x - movement.ganttLeft - movement.itemX;
        createGhost(data, ev, ganttRect.left, ganttRect.top);
      }

      function resizerMouseDown(ev) {
        ev.stopPropagation();
        if (ev.button !== 0) {
          return;
        }
        const movement = getMovement(data);
        movement.resizing = true;
        const item = state.get(`config.chart.items.${data.item.id}`);
        const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
        const timePerPixel = state.get('_internal.chart.time.timePerPixel');
        const ganttRect = state.get('_internal.elements.chart-timeline').getBoundingClientRect();
        movement.ganttTop = ganttRect.top;
        movement.ganttLeft = ganttRect.left;
        movement.itemX = (item.time.end - chartLeftTime) / timePerPixel;
        movement.itemLeftCompensation = ev.x - movement.ganttLeft - movement.itemX;
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

      function movementX(ev, row, item, zoom, timePerPixel) {
        ev.stopPropagation();
        const movement = getMovement(data);
        const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
        moveGhost(data, ev);
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

      function resizeX(ev, row, item, zoom, timePerPixel) {
        ev.stopPropagation();
        if (!isResizeable(data)) {
          return;
        }
        const time = state.get('_internal.chart.time');
        const movement = getMovement(data);
        const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
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

      function movementY(ev, row, item, zoom, timePerPixel) {
        ev.stopPropagation();
        moveGhost(data, ev);
        const movement = getMovement(data);
        const top = ev.y - movement.ganttTop;
        const visibleRows = state.get('_internal.list.visibleRows');
        const compensation = state.get('config.scroll.compensation');
        let index = 0;
        for (const currentRow of visibleRows) {
          if (currentRow.top + compensation > top) {
            if (index > 0) {
              return index - 1;
            }
            return 0;
          }
          index++;
        }
        return index;
      }

      function documentMouseMove(ev) {
        const movement = getMovement(data);
        let item, rowId, row, zoom, timePerPixel;
        if (movement.moving || movement.resizing) {
          ev.stopPropagation();
          item = state.get(`config.chart.items.${data.item.id}`);
          rowId = state.get(`config.chart.items.${data.item.id}.rowId`);
          row = state.get(`config.list.rows.${rowId}`);
          zoom = state.get('config.chart.time.zoom');
          timePerPixel = state.get('_internal.chart.time.timePerPixel');
        }
        const moveable = isMoveable(data);
        if (movement.moving) {
          if (moveable === true || moveable === 'x' || (Array.isArray(moveable) && moveable.includes(rowId))) {
            movementX(ev, row, item, zoom, timePerPixel);
          }
          if (!moveable || moveable === 'x') {
            return;
          }
          let visibleRowsIndex = movementY(ev);
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
          resizeX(ev, row, item, zoom, timePerPixel);
        }
      }

      function documentMouseUp(ev) {
        const movement = getMovement(data);
        if (movement.moving || movement.resizing) {
          ev.stopPropagation();
        }
        movement.moving = false;
        movement.resizing = false;
        for (const itemId in movementState) {
          movementState[itemId].moving = false;
          movementState[itemId].resizing = false;
          destroyGhost(itemId);
        }
      }
      element.addEventListener('mousedown', labelMouseDown);
      resizerEl.addEventListener('mousedown', resizerMouseDown, { capture: true });
      document.addEventListener('mousemove', documentMouseMove, { capture: true, passive: true });
      document.addEventListener('mouseup', documentMouseUp, { capture: true, passive: true });
      return {
        update(node, changedData) {
          data = changedData;
          if (!isResizeable(data)) {
            resizerEl.style.visibility = 'hidden';
          } else {
            resizerEl.style.visibility = 'visible';
          }
        },
        destroy(node, data) {
          element.removeEventListener('mousedown', labelMouseDown);
          resizerEl.removeEventListener('mousedown', resizerMouseDown);
          document.removeEventListener('mousemove', documentMouseMove);
          document.removeEventListener('mouseup', documentMouseUp);
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

  return ItemMovement;

})));
//# sourceMappingURL=ItemMovement.plugin.js.map
