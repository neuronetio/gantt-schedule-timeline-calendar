export const itemMovement = function itemMovementPlugin(options = {}) {
  const defaultOptions = {
    moveable: true,
    resizeable: true,
    resizerContent: '',
    collisionDetection: true
  };
  options = { ...defaultOptions, ...options };
  const movementState = {};

  /**
   * Add moving functionality to items as action
   *
   * @param {Node} node DOM Node
   * @param {Object} data
   */
  function itemAction(node, data) {
    if (!options.moveable && !options.resizeable) {
      return;
    }
    let moveable = options.moveable;
    if (data.item.hasOwnProperty('moveable') && moveable) {
      moveable = data.item.moveable;
    }
    if (data.row.hasOwnProperty('moveable') && moveable) {
      moveable = data.row.moveable;
    }
    let resizeable = options.resizeable && (!data.item.hasOwnProperty('resizeable') || data.item.resizeable === true);
    if (data.row.hasOwnProperty('resizeable') && resizeable) {
      resizeable = data.row.resizeable;
    }
    const api = data.api;

    if (resizeable) {
      const resizerHTML = `<div class="${api.getClass('chart-gantt-items-row-item-content-resizer')}">${
        options.resizerContent
      }</div>`;
      // @ts-ignore
      node.firstChild.insertAdjacentHTML('beforeend', resizerHTML);
    }

    const el = node.firstChild;
    const labelEl = el.firstChild;
    const resizerEl = el.childNodes[1];

    const state = data.state;

    if (typeof movementState[data.item.id] === 'undefined') {
      movementState[data.item.id] = { moving: false, resizing: false };
    }
    const movement = movementState[data.item.id];

    function labelMouseDown(ev) {
      movement.moving = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.Gantt').getBoundingClientRect();
      movement.ganttTop = ganttRect.top;
      movement.ganttLeft = ganttRect.left;
      movement.itemX = Math.round((item.time.start - chartLeftTime) / timePerPixel);
      movement.itemLeftCompensation = ev.x - movement.ganttLeft - movement.itemX;
    }

    function resizerMouseDown(ev) {
      ev.stopPropagation();
      movement.resizing = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.Gantt').getBoundingClientRect();
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
      if (start < time.from || end > time.to) {
        return true;
      }
      if (api.time.date(end).diff(start, time.period) < 0) {
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
      const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
      const leftMs = state.get('_internal.chart.time.leftGlobal') + left * timePerPixel;
      const add = leftMs - item.time.start;
      const originalStart = item.time.start;
      const finalStartTime = data.api.time
        .date(item.time.start + add)
        .startOf('day')
        .valueOf();
      const finalAdd = finalStartTime - originalStart;
      const collision = isCollision(row.id, item.id, item.time.start + finalAdd, item.time.end + finalAdd);
      if (finalAdd && !collision) {
        state.update(`config.chart.items.${data.item.id}.time`, function moveItem(time) {
          time.start += finalAdd;
          time.end += finalAdd;
          return time;
        });
      }
    }

    function resizeX(ev, row, item, zoom, timePerPixel) {
      const time = state.get('_internal.chart.time');
      const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
      const leftMs = time.leftGlobal + left * timePerPixel;
      const add = leftMs - item.time.end;
      if (item.time.end + add < item.time.start) {
        return;
      }
      const originalEnd = item.time.end;
      const finalEndTime = data.api.time
        .date(item.time.end + add)
        .endOf(time.period)
        .valueOf();
      const finalAdd = finalEndTime - originalEnd;
      const collision = isCollision(row.id, item.id, item.time.start, item.time.end + finalAdd);
      if (finalAdd && !collision) {
        state.update(`config.chart.items.${data.item.id}.time.end`, function resizeItem(end) {
          return (end += finalAdd);
        });
      }
    }

    function movementY(ev, row, item, zoom, timePerPixel) {
      const top = ev.y - movement.ganttTop;
      const visibleRows = state.get('_internal.list.visibleRows');
      let index = 0;
      for (const currentRow of visibleRows) {
        if (currentRow.top > top) {
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
      let item, rowId, row, zoom, timePerPixel;
      if (movement.moving || movement.resizing) {
        item = state.get(`config.chart.items.${data.item.id}`);
        rowId = state.get(`config.chart.items.${data.item.id}.rowId`);
        row = state.get(`config.list.rows.${rowId}`);
        zoom = state.get('config.chart.time.zoom');
        timePerPixel = state.get('_internal.chart.time.timePerPixel');
      }
      if (movement.moving) {
        if (moveable === true || moveable === 'x' || (Array.isArray(moveable) && moveable.includes(rowId))) {
          movementX(ev, row, item, zoom, timePerPixel);
        }
        if (!moveable || moveable === 'x') {
          return;
        }
        let visibleRowsIndex = movementY(ev, row, item, zoom, timePerPixel);
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
      movement.moving = false;
      movement.resizing = false;
    }

    if (moveable) el.addEventListener('mousedown', labelMouseDown);
    if (resizeable) resizerEl.addEventListener('mousedown', resizerMouseDown);
    document.addEventListener('mousemove', documentMouseMove);
    document.addEventListener('mouseup', documentMouseUp);

    return {
      update(data) {},
      destroy() {
        if (moveable) el.removeEventListener('moudedown', labelMouseDown);
        if (resizeable) resizerEl.removeEventListener('mousedown', resizerMouseDown);
        document.removeEventListener('mousemove', documentMouseMove);
        document.removeEventListener('mouseup', documentMouseUp);
      }
    };
  }

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-gantt-items-row-item', actions => {
      if (!actions.includes(itemAction)) {
        actions.push(itemAction);
      }
      return actions;
    });
  };
};

export default itemMovement;
