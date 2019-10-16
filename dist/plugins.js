/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

function ItemHoldPlugin(options = {}) {
  const defaultOptions = {
    time: 1000,
    movementThreshold: 2,
    action(element, data) {}
  };
  options = { ...defaultOptions, ...options };

  const holding = {};
  const mouse = { x: 0, y: 0 };

  function onMouseDown(item, element, event) {
    if (typeof holding[item.id] === 'undefined') {
      holding[item.id] = { x: event.x, y: event.y };
      setTimeout(() => {
        if (typeof holding[item.id] !== 'undefined') {
          let exec = true;
          let xMovement = holding[item.id].x - mouse.x;
          if (Math.sign(xMovement) === -1) {
            xMovement = -xMovement;
          }
          let yMovement = holding[item.id].y - mouse.y;
          if (Math.sign(yMovement) === -1) {
            yMovement = -yMovement;
          }
          if (xMovement > options.movementThreshold) {
            exec = false;
          }
          if (yMovement > options.movementThreshold) {
            exec = false;
          }
          delete holding[item.id];
          if (exec) {
            options.action(element, item);
          }
        }
      }, options.time);
    }
  }

  function onMouseUp(itemId) {
    if (typeof holding[itemId] !== 'undefined') {
      delete holding[itemId];
    }
  }

  const mouseUps = [];
  const mouseMoves = [];

  function action(element, data) {
    element.addEventListener('mousedown', event => {
      onMouseDown(data.item, element, event);
    });
    function mouseUp() {
      onMouseUp(data.item.id);
    }
    mouseUps.push(mouseUp);
    document.addEventListener('mouseup', mouseUp);
    function mouseMove(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    }
    mouseMoves.push(mouseMove);
    document.addEventListener('mousemove', mouseMove);
    return {
      destroy(element, data) {
        mouseUps.forEach(mouseUp => document.removeEventListener('mouseup', mouseUp));
        mouseMoves.forEach(mouseMove => document.removeEventListener('mousemove', mouseMove));
      }
    };
  }

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-gantt-items-row-item', actions => {
      actions.push(action);
      return actions;
    });
  };
}

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

// @ts-nocheck
function ItemMovementPlugin(options = {}) {
  const defaultOptions = {
    moveable: true,
    resizeable: true,
    resizerContent: '',
    collisionDetection: true,
    outOfBorders: false,
    snapStart: [],
    snapEnd: [],
    ghostNode: true
  };
  options = { ...defaultOptions, ...options };
  options.snapStart = options.snapStart.slice();
  options.snapEnd = options.snapEnd.slice();
  const movementState = {};

  /**
   * Add moving functionality to items as action
   *
   * @param {Node} node DOM Node
   * @param {Object} data
   */
  function action(node, data) {
    const element = node.querySelector('.gantt-schedule-timeline-calendar__chart-gantt-items-row-item-content');
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
    let snapStart = options.snapStart;
    if (typeof data.item.snapStart !== 'undefined' && Array.isArray(data.item.snapStart)) {
      snapStart = item.snapStart;
    }
    let snapEnd = options.snapEnd;
    if (typeof data.item.snapEnd !== 'undefined' && Array.isArray(data.item.snapEnd)) {
      snapEnd = data.item.snapEnd;
    }

    if (resizeable) {
      const resizerHTML = `<div class="${api.getClass('chart-gantt-items-row-item-content-resizer')}">${
        options.resizerContent
      }</div>`;
      // @ts-ignore
      element.insertAdjacentHTML('beforeend', resizerHTML);
    }

    const el = element;
    const resizerEl = el.querySelector('.gantt-schedule-timeline-calendar__chart-gantt-items-row-item-content-resizer');
    const state = data.state;

    if (typeof movementState[data.item.id] === 'undefined') {
      movementState[data.item.id] = { moving: false, resizing: false };
    }
    const movement = movementState[data.item.id];

    function createGhost(itemId, ev, ganttLeft, ganttTop) {
      if (!options.ghostNode || typeof movementState[itemId].ghost !== 'undefined') {
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
      state.get('_internal.elements.gantt').appendChild(ghost);
      movementState[itemId].ghost = ghost;
      return ghost;
    }

    function moveGhost(ev) {
      if (options.ghostNode) {
        const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
        movement.ghost.style.left = left + 'px';
        movement.ghost.style.top = ev.y - movement.ganttTop - movement.itemTop + 'px';
      }
    }

    function destroyGhost(itemId) {
      if (!options.ghostNode) {
        return;
      }
      if (typeof movementState[itemId] !== 'undefined' && typeof movementState[itemId].ghost !== 'undefined') {
        state.get('_internal.elements.gantt').removeChild(movementState[itemId].ghost);
        delete movementState[itemId].ghost;
      }
      element.style.opacity = '1';
    }

    function labelMouseDown(ev) {
      if (ev.button !== 0) {
        return;
      }
      movement.moving = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.gantt').getBoundingClientRect();
      movement.ganttTop = ganttRect.top;
      movement.ganttLeft = ganttRect.left;
      movement.itemX = Math.round((item.time.start - chartLeftTime) / timePerPixel);
      movement.itemLeftCompensation = ev.x - movement.ganttLeft - movement.itemX;
      createGhost(data.item.id, ev, ganttRect.left, ganttRect.top);
    }

    function resizerMouseDown(ev) {
      if (ev.button !== 0) {
        return;
      }
      ev.stopPropagation();
      movement.resizing = true;
      const item = state.get(`config.chart.items.${data.item.id}`);
      const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
      const timePerPixel = state.get('_internal.chart.time.timePerPixel');
      const ganttRect = state.get('_internal.elements.gantt').getBoundingClientRect();
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

    function snap(addMilliseconds, currentDate, addToEnd = 0, snapValues = []) {
      let smallestDiff = Number.MAX_SAFE_INTEGER;
      let smallestTime = 0;
      for (let snapTime of snapValues) {
        let diff = currentDate
          .clone()
          .add(addMilliseconds, 'milliseconds')
          .diff(snapTime, 'milliseconds');
        if (Math.sign(diff) === -1) {
          diff = -diff;
        }
        if (diff < smallestDiff) {
          smallestDiff = diff;
          smallestTime = snapTime;
        }
      }
      smallestTime += addToEnd;
      return api.time.date(smallestTime);
    }

    function movementX(ev, row, item, zoom, timePerPixel) {
      const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
      moveGhost(ev);
      const leftMs = state.get('_internal.chart.time.leftGlobal') + left * timePerPixel;
      const add = leftMs - item.time.start;
      const originalStart = item.time.start;
      const finalStartTime = snap(add, data.api.time.date(item.time.start), 0, snapStart);
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
      const finalEndTime = snap(add, data.api.time.date(item.time.end), -1, snapEnd);
      const finalAdd = finalEndTime - originalEnd;
      const collision = isCollision(row.id, item.id, item.time.start, item.time.end + finalAdd);
      if (finalAdd && !collision) {
        state.update(`config.chart.items.${data.item.id}.time.end`, function resizeItem(end) {
          return (end += finalAdd);
        });
      }
    }

    function movementY(ev, row, item, zoom, timePerPixel) {
      moveGhost(ev);
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
      movement.moving = false;
      movement.resizing = false;
      for (const itemId in movementState) {
        movementState[itemId].moving = false;
        movementState[itemId].resizing = false;
        destroyGhost(itemId);
      }
    }
    if (moveable) el.addEventListener('mousedown', labelMouseDown);
    if (resizeable) resizerEl.addEventListener('mousedown', resizerMouseDown);
    document.addEventListener('mousemove', documentMouseMove);
    document.addEventListener('mouseup', documentMouseUp);

    return {
      destroy(node, data) {
        if (moveable) el.removeEventListener('moudedown', labelMouseDown);
        if (resizeable) resizerEl.removeEventListener('mousedown', resizerMouseDown);
        document.removeEventListener('mousemove', documentMouseMove);
        document.removeEventListener('mouseup', documentMouseUp);
        if (resizeable) element.removeChild(resizerEl);
      }
    };
  }

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-gantt-items-row-item', actions => {
      actions.push(action);
      return actions;
    });
  };
}

/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

// @ts-nocheck
function SaveAsImage(options = {}) {
  const defaultOptions = {
    style: 'font-family: sans-serif;',
    filename: 'gantt-schedule-timeline-calendar.jpeg'
  };
  options = { ...defaultOptions, options };
  function downloadImage(data, filename) {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  }

  function saveAsImage(ev) {
    const element = ev.target;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const html = unescape(encodeURIComponent(element.outerHTML));
    let style = '';
    for (const styleSheet of document.styleSheets) {
      if (styleSheet.title === 'gstc') {
        for (const rule of styleSheet.rules) {
          style += rule.cssText;
        }
      }
    }
    style = `<style>* {${options.style}} ${style}</style>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject x="0" y="0" width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${style}
          ${html}
        </div>
      </foreignObject>
    </svg>`;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    const svg64 = 'data:image/svg+xml;base64,' + btoa(svg);
    const img = new Image();
    img.onload = function onLoad() {
      ctx.drawImage(img, 0, 0);
      const jpeg = canvas.toDataURL('image/jpeg', 1.0);
      downloadImage(jpeg, options.filename);
    };
    img.src = svg64;
  }

  return function initializePlugin(state, api) {
    state.subscribe('_internal.elements.main', main => {
      if (main) {
        main.addEventListener('save-as-image', saveAsImage);
      }
    });
  };
}

export { ItemHoldPlugin as ItemHold, ItemMovementPlugin as ItemMovement, SaveAsImage };
//# sourceMappingURL=plugins.js.map
