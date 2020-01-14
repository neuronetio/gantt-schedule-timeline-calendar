/**
 * ItemHold plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function ItemHold(options = {}) {
    let api;
    const defaultOptions = {
        time: 1000,
        movementThreshold: 2,
        action(element, data) { }
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    const holding = {};
    const pointer = { x: 0, y: 0 };
    function onPointerDown(item, element, event) {
        if (typeof holding[item.id] === 'undefined') {
            const normalized = api.normalizePointerEvent(event);
            holding[item.id] = { x: normalized.x, y: normalized.y };
            event.stopPropagation();
            event.preventDefault();
            setTimeout(() => {
                if (typeof holding[item.id] !== 'undefined') {
                    let exec = true;
                    const xMovement = Math.abs(holding[item.id].x - pointer.x);
                    const yMovement = Math.abs(holding[item.id].y - pointer.y);
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
    function onPointerUp(itemId) {
        if (typeof holding[itemId] !== 'undefined') {
            delete holding[itemId];
        }
    }
    function action(element, data) {
        function elementPointerDown(event) {
            onPointerDown(data.item, element, event);
        }
        element.addEventListener('mousedown', elementPointerDown);
        element.addEventListener('touchstart', elementPointerDown);
        function pointerUp() {
            onPointerUp(data.item.id);
        }
        document.addEventListener('mouseup', pointerUp);
        document.addEventListener('touchend', pointerUp);
        function onPointerMove(event) {
            const normalized = api.normalizePointerEvent(event);
            pointer.x = normalized.x;
            pointer.y = normalized.y;
        }
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove);
        return {
            update(element, changedData) {
                data = changedData;
            },
            destroy(element, data) {
                document.removeEventListener('mouseup', onPointerUp);
                document.removeEventListener('mousemove', onPointerMove);
                element.removeEventListener('mousedown', elementPointerDown);
                document.removeEventListener('touchend', onPointerUp);
                document.removeEventListener('touchmove', onPointerMove);
                element.removeEventListener('touchstart', elementPointerDown);
            }
        };
    }
    return function initialize(vido) {
        api = vido.api;
        vido.state.update('config.actions.chart-timeline-items-row-item', actions => {
            actions.push(action);
            return actions;
        });
    };
}

/**
 * ItemMovement plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
const pointerEventsExists = typeof PointerEvent !== 'undefined';
function ItemMovement(options = {}) {
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
        ghostNode: true,
        wait: 0
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    const movementState = {};
    /**
     * Add moving functionality to items as action
     *
     * @param {HTMLElement} element DOM Node
     * @param {Object} data
     */
    function action(element, data) {
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
                movementState[itemId] = { moving: false, resizing: false, waiting: false };
            }
            return movementState[itemId];
        }
        function saveMovement(itemId, movement) {
            state.update(`config.plugin.ItemMovement.items.${itemId}`, movement);
            state.update('config.plugin.ItemMovement.movement', current => {
                if (!current) {
                    current = { moving: false, waiting: false };
                }
                current.moving = movement.moving;
                current.waiting = movement.waiting;
                return current;
            });
        }
        function createGhost(data, normalized, ganttLeft, ganttTop) {
            const movement = getMovement(data);
            if (!options.ghostNode || typeof movement.ghost !== 'undefined') {
                return;
            }
            const ghost = element.cloneNode(true);
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
            saveMovement(data.item.id, movement);
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
                saveMovement(data.item.id, movement);
            }
        }
        function destroyGhost(itemId) {
            if (!options.ghostNode) {
                return;
            }
            if (typeof movementState[itemId] !== 'undefined' && typeof movementState[itemId].ghost !== 'undefined') {
                state.get('_internal.elements.chart-timeline').removeChild(movementState[itemId].ghost);
                delete movementState[itemId].ghost;
                saveMovement(data.item.id, movementState[itemId]);
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
        const resizerHTML = `<div class="${api.getClass('chart-timeline-items-row-item-resizer')}">${options.resizerContent}</div>`;
        // @ts-ignore
        element.insertAdjacentHTML('beforeend', resizerHTML);
        const resizerEl = element.querySelector('.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-resizer');
        if (!isResizeable(data)) {
            resizerEl.style.visibility = 'hidden';
        }
        else {
            resizerEl.style.visibility = 'visible';
        }
        function labelDown(ev) {
            const normalized = api.normalizePointerEvent(ev);
            if ((ev.type === 'pointerdown' || ev.type === 'mousedown') && ev.button !== 0) {
                return;
            }
            const movement = getMovement(data);
            movement.waiting = true;
            saveMovement(data.item.id, movement);
            setTimeout(() => {
                ev.stopPropagation();
                ev.preventDefault();
                if (!movement.waiting)
                    return;
                movement.moving = true;
                const item = state.get(`config.chart.items.${data.item.id}`);
                const chartLeftTime = state.get('_internal.chart.time.leftGlobal');
                const timePerPixel = state.get('_internal.chart.time.timePerPixel');
                const ganttRect = state.get('_internal.elements.chart-timeline').getBoundingClientRect();
                movement.ganttTop = ganttRect.top;
                movement.ganttLeft = ganttRect.left;
                movement.itemX = Math.round((item.time.start - chartLeftTime) / timePerPixel);
                movement.itemLeftCompensation = normalized.clientX - movement.ganttLeft - movement.itemX;
                saveMovement(data.item.id, movement);
                createGhost(data, normalized, ganttRect.left, ganttRect.top);
            }, options.wait);
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
            saveMovement(data.item.id, movement);
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
                let visibleRowsIndex = movementY(normalized);
                const visibleRows = state.get('_internal.list.visibleRows');
                if (typeof visibleRows[visibleRowsIndex] === 'undefined') {
                    if (visibleRowsIndex > 0) {
                        visibleRowsIndex = visibleRows.length - 1;
                    }
                    else if (visibleRowsIndex < 0) {
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
            }
            else if (movement.resizing && (typeof item.resizeable === 'undefined' || item.resizeable === true)) {
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
            movement.waiting = false;
            movement.resizing = false;
            saveMovement(data, movement);
            for (const itemId in movementState) {
                movementState[itemId].moving = false;
                movementState[itemId].resizing = false;
                movementState[itemId].waiting = false;
                destroyGhost(itemId);
            }
        }
        if (pointerEventsExists) {
            element.addEventListener('pointerdown', labelDown);
            resizerEl.addEventListener('pointerdown', resizerDown);
            document.addEventListener('pointermove', documentMove);
            document.addEventListener('pointerup', documentUp);
        }
        else {
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
                }
                else if (isResizeable(changedData) && resizerEl.style.visibility === 'hidden') {
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
                }
                else {
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

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * Used to clone existing node instead of each time creating new one which is
 * slower
 */
const markerNode = document.createComment('');
/**
 * Used to clone existing node instead of each time creating new one which is
 * slower
 */
const emptyTemplateNode = document.createElement('template');
/**
 * Used to clone text node instead of each time creating new one which is slower
 */
const emptyTextNode = document.createTextNode('');
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // noop
    }
})();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
    // If we run in the browser set version
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.5');
}
/**
 * Used to clone existing node instead of each time creating new one which is
 * slower
 */
const emptyTemplateNode$1 = document.createElement('template');

class Action {
    constructor() {
        this.isAction = true;
    }
}
Action.prototype.isAction = true;

const defaultOptions = {
    element: document.createTextNode(''),
    axis: 'xy',
    threshold: 10,
    onDown(data) { },
    onMove(data) { },
    onUp(data) { },
    onWheel(data) { }
};

/**
 * Selection plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function Selection(options = {}) {
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
    const defaultOptions = {
        grid: false,
        items: true,
        rows: false,
        horizontal: true,
        vertical: true,
        rectStyle: {},
        selecting() { },
        deselecting() { },
        selected() { },
        deselected() { },
        canSelect(type, currently, all) {
            return currently;
        },
        canDeselect(type, currently, all) {
            return [];
        },
        getApi() { }
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    for (const styleProp in options.rectStyle) {
        rect.style[styleProp] = options.rectStyle[styleProp];
    }
    const selecting = {
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
        }
        else {
            state.update(`${pluginPath}.selecting`, nowSelecting);
        }
        state.update('config.chart.items', function updateItems(items) {
            const now = nowSelecting['chart-timeline-items-row-items'];
            for (const itemId in items) {
                const item = items[itemId];
                if (now.includes(item.id)) {
                    item.selecting = true;
                }
                else {
                    item.selecting = false;
                }
            }
            return items;
        }, { only: ['selecting'] });
        state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
            const nowBlocks = nowSelecting['chart-timeline-grid-row-blocks'];
            const nowRows = nowSelecting['chart-timeline-grid-rows'];
            if (rowsWithBlocks)
                for (const row of rowsWithBlocks) {
                    if (nowRows.includes(row.id)) {
                        row.selecting = true;
                    }
                    else {
                        row.selecting = false;
                    }
                    for (const block of row.blocks) {
                        if (nowBlocks.includes(block.id)) {
                            block.selecting = true;
                        }
                        else {
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
        }
        else {
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
                            : options.canDeselect('chart-timeline-grid-rows', currently.selected['chart-timeline-grid-rows'], currently),
                        'chart-timeline-grid-row-blocks': clear
                            ? []
                            : options.canDeselect('chart-timeline-grid-row-blocks', currently.selected['chart-timeline-grid-row-blocks'], currently),
                        'chart-timeline-items-rows': clear
                            ? []
                            : options.canDeselect('chart-timeline-items-rows', currently.selected['chart-timeline-items-rows'], currently),
                        'chart-timeline-items-row-items': clear
                            ? []
                            : options.canDeselect('chart-timeline-items-row-items', currently.selected['chart-timeline-items-row-items'], currently)
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
        const select = {};
        if (addToPrevious) {
            state.update(pluginPath, value => {
                const selected = Object.assign({}, value.selecting);
                for (const name in value.selected) {
                    for (const id of selected[name]) {
                        if (!value.selected[name].includes(id)) {
                            value.selected[name].push(id);
                        }
                    }
                }
                select.selected = Object.assign({}, value.selected);
                select.selecting = getEmptyContainer();
                return select;
            });
        }
        else {
            state.update(pluginPath, value => {
                select.selected = Object.assign({}, value.selecting);
                select.selecting = getEmptyContainer();
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
                }
                else if (addToPrevious && previousSelect.selected['chart-timeline-items-row-items'].includes(item.id)) {
                    item.selected = true;
                }
                else {
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
                        }
                        else if (addToPrevious && previousSelect.selected['chart-timeline-grid-row-blocks'].includes(block.id)) {
                            block.selected = true;
                        }
                        else {
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
        const result = {};
        result.selecting = Object.assign({}, currentSelect.selecting);
        result.selecting['chart-timeline-grid-rows'] = currentSelect.selecting['chart-timeline-grid-rows'].slice();
        result.selecting['chart-timeline-grid-row-blocks'] = currentSelect.selecting['chart-timeline-grid-row-blocks'].slice();
        result.selecting['chart-timeline-items-rows'] = currentSelect.selecting['chart-timeline-items-rows'].slice();
        result.selecting['chart-timeline-items-row-items'] = currentSelect.selecting['chart-timeline-items-row-items'].slice();
        result.selected = Object.assign({}, currentSelect.selected);
        result.selected['chart-timeline-grid-rows'] = currentSelect.selected['chart-timeline-grid-rows'].slice();
        result.selected['chart-timeline-grid-row-blocks'] = currentSelect.selected['chart-timeline-grid-row-blocks'].slice();
        result.selected['chart-timeline-items-rows'] = currentSelect.selected['chart-timeline-items-rows'].slice();
        result.selected['chart-timeline-items-row-items'] = currentSelect.selected['chart-timeline-items-row-items'].slice();
        return result;
    }
    /**
     * Selection action class
     */
    class SelectionAction extends Action {
        /**
         * Selection action constructor
         * @param {Element} element
         * @param {object|any} data
         */
        constructor(element, data) {
            super();
            const api = {};
            api.clearSelection = clearSelection;
            this.unsub = data.state.subscribeAll(['_internal.elements.chart-timeline', '_internal.chart.dimensions.width'], bulk => {
                const chartTimeline = state.get('_internal.elements.chart-timeline');
                if (chartTimeline === undefined)
                    return;
                this.chartTimeline = chartTimeline;
                if (!this.chartTimeline.querySelector('.' + rectClassName)) {
                    this.chartTimeline.insertAdjacentElement('beforeend', rect);
                }
                const bounding = this.chartTimeline.getBoundingClientRect();
                this.left = bounding.left;
                this.top = bounding.top;
            });
            /**
             * Save and swap coordinates if needed
             * @param {MouseEvent} ev
             */
            const saveAndSwapIfNeeded = (ev) => {
                const currentX = ev.x - this.left;
                const currentY = ev.y - this.top;
                if (currentX <= selecting.startX) {
                    selecting.fromX = currentX;
                    selecting.toX = selecting.startX;
                }
                else {
                    selecting.fromX = selecting.startX;
                    selecting.toX = currentX;
                }
                if (currentY <= selecting.startY) {
                    selecting.fromY = currentY;
                    selecting.toY = selecting.startY;
                }
                else {
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
            const isInside = (boundingRect, rectBoundingRect) => {
                let horizontal = false;
                let vertical = false;
                if ((boundingRect.left > rectBoundingRect.left && boundingRect.left < rectBoundingRect.right) ||
                    (boundingRect.right > rectBoundingRect.left && boundingRect.right < rectBoundingRect.right) ||
                    (boundingRect.left <= rectBoundingRect.left && boundingRect.right >= rectBoundingRect.right)) {
                    horizontal = true;
                }
                if ((boundingRect.top > rectBoundingRect.top && boundingRect.top < rectBoundingRect.bottom) ||
                    (boundingRect.bottom > rectBoundingRect.top && boundingRect.bottom < rectBoundingRect.bottom) ||
                    (boundingRect.top <= rectBoundingRect.top && boundingRect.bottom >= rectBoundingRect.bottom)) {
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
            const getSelecting = (rectBoundingRect, elements, type, getId) => {
                const selectingResult = [];
                const currentlySelectingData = [];
                const all = elements[type + 's'];
                if (!all)
                    return [];
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
                        }
                        else {
                            currentlySelectingData.unshift();
                        }
                    }
                    else {
                        if (currentSelecting.includes(getId(element.vido))) {
                            options.deselecting(element.vido, type);
                        }
                    }
                }
                return selectingResult;
            };
            /**
             * Select
             * @param {Event} ev
             */
            function trackSelection(ev, virtually = false) {
                const movement = state.get('config.plugin.ItemMovement.movement');
                const moving = movement && (movement.moving || movement.waiting);
                if (!selecting.selecting || moving) {
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
                    if (selecting.fromX === ev.x - this.left && selecting.fromY === ev.y - this.top) {
                        selecting.selecting = false;
                        rect.style.visibility = 'hidden';
                        return;
                    }
                }
                else {
                    const itemClass = '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item';
                    const isItem = !!ev.target.closest(itemClass);
                    if (!isItem) {
                        if (!ev.ctrlKey)
                            clearSelection();
                    }
                    else {
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
                if (ev.button !== 0 || moving) {
                    return;
                }
                selecting.selecting = true;
                selecting.fromX = ev.x - this.left;
                selecting.fromY = ev.y - this.top;
                selecting.startX = selecting.fromX;
                selecting.startY = selecting.fromY;
                previousSelect = cloneSelection(state.get(pluginPath));
                const itemClass = '.gantt-schedule-timeline-calendar__chart-timeline-items-row-item';
                const isItem = !!ev.target.closest(itemClass);
                if (!isItem) {
                    if (!ev.ctrlKey)
                        clearSelection();
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
            document.addEventListener('mousemove', schedule(this.mouseMove));
            document.addEventListener('mouseup', this.mouseUp);
            options.getApi(api);
        }
        destroy(element) {
            document.removeEventListener('mouseup', this.mouseUp);
            document.removeEventListener('mousemove', this.mouseMove);
            element.removeEventListener('mousedown', this.mouseDown);
            this.unsub();
        }
    }
    /**
     * Update selection
     * @param {any} data
     * @param {HTMLElement} element
     * @param {string[]} selecting
     * @param {string[]} selected
     * @param {string} classNameSelecting
     * @param {string} classNameSelected
     */
    function updateSelection(element, selecting, selected, classNameSelecting, classNameSelected) {
        if (selecting && !element.classList.contains(classNameSelecting)) {
            element.classList.add(classNameSelecting);
        }
        else if (!selecting && element.classList.contains(classNameSelecting)) {
            element.classList.remove(classNameSelecting);
        }
        if (selected && !element.classList.contains(classNameSelected)) {
            element.classList.add(classNameSelected);
        }
        else if (!selected && element.classList.contains(classNameSelected)) {
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
        constructor(element, data) {
            super();
            this.classNameSelecting = api.getClass('chart-timeline-grid-row-block') + '--selecting';
            this.classNameSelected = api.getClass('chart-timeline-grid-row-block') + '--selected';
            updateSelection(element, data.selecting, data.selected, this.classNameSelecting, this.classNameSelected);
        }
        update(element, data) {
            updateSelection(element, data.selecting, data.selected, this.classNameSelecting, this.classNameSelected);
        }
        destroy(element, changedData) {
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
        constructor(element, data) {
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
            updateSelection(element, data.item.selecting, data.item.selected, this.classNameSelecting, this.classNameSelected);
        }
        onPointerDown(ev) {
            previousSelect = cloneSelection(state.get(pluginPath));
            selecting.selecting = true;
            this.data.item.selected = true;
            const container = getEmptyContainer();
            container['chart-timeline-items-row-items'].push(this.data.item.id);
            markSelecting(container);
            markSelected(ev.ctrlKey);
            updateSelection(this.element, this.data.item.selecting, this.data.item.selected, this.classNameSelecting, this.classNameSelected);
        }
        update(element, data) {
            updateSelection(element, data.item.selecting, data.item.selected, this.classNameSelecting, this.classNameSelected);
            this.data = data;
        }
        destroy(element, data) {
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

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t=t=>(...e)=>{const n=t(...e);return n.isDirective=!0,n};class e{constructor(){this.isDirective=!0,this.isClass=!0;}body(t){}}const n=t=>null!=t&&"boolean"==typeof t.isDirective,o="undefined"!=typeof window&&(null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback),s=(t,e,n=null,o=null)=>{for(;e!==n;){const n=e.nextSibling;t.insertBefore(e,o),e=n;}},i=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n;}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,h=new RegExp(`${l}|${c}`),d="$lit$";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */class p{constructor(t,e){this.parts=[],this.element=e;const n=[],o=[],s=document.createTreeWalker(e.content,133,null,!1);let i=0,r=-1,a=0;const{strings:c,values:{length:p}}=t;for(;a<p;){const t=s.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let o=0;for(let t=0;t<n;t++)u(e[t].name,d)&&o++;for(;o-- >0;){const e=c[a],n=f.exec(e)[2],o=n.toLowerCase()+d,s=t.getAttribute(o);t.removeAttribute(o);const i=s.split(h);this.parts.push({type:"attribute",index:r,name:n,strings:i,sanitizer:void 0}),a+=i.length-1;}}"TEMPLATE"===t.tagName&&(o.push(t),s.currentNode=t.content);}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const o=t.parentNode,s=e.split(h),i=s.length-1;for(let e=0;e<i;e++){let n,i=s[e];if(""===i)n=y();else{const t=f.exec(i);null!==t&&u(t[2],d)&&(i=i.slice(0,t.index)+t[1]+t[2].slice(0,-d.length)+t[3]),n=document.createTextNode(i);}o.insertBefore(n,t),this.parts.push({type:"node",index:++r});}""===s[i]?(o.insertBefore(y(),t),n.push(t)):t.data=s[i],a+=i;}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&r!==i||(r++,e.insertBefore(y(),t)),i=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(n.push(t),r--),a++;}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),a++;}}else s.currentNode=o.pop();}for(const t of n)t.parentNode.removeChild(t);}}const u=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},m=t=>-1!==t.index,v=document.createComment(""),y=()=>v.cloneNode(),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class g{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n;}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit();}_clone(){const t=o?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,s=document.createTreeWalker(t,133,null,!1);let i,r=0,a=0,l=s.nextNode();for(;r<n.length;)if(i=n[r],m(i)){for(;a<i.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),s.currentNode=l.content),null===(l=s.nextNode())&&(s.currentNode=e.pop(),l=s.nextNode());if("node"===i.type){const t=this.processor.handleTextExpression(this.options,i);t.insertAfterNode(l.previousSibling),this.__parts.push(t);}else this.__parts.push(...this.processor.handleAttributeExpressions(l,i.name,i.strings,this.options,i));r++;}else this.__parts.push(void 0),r++;return o&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */let x;const b=` ${l} `,_=document.createElement("template");class w{constructor(t,e,n,o){this.strings=t,this.values=e,this.type=n,this.processor=o;}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let o=0;o<t;o++){const t=this.strings[o],s=t.lastIndexOf("\x3c!--");n=(s>-1||n)&&-1===t.indexOf("--\x3e",s+1);const i=f.exec(t);e+=null===i?t+(n?b:c):t.substr(0,i.index)+i[1]+i[2]+d+i[3]+l;}return e+=this.strings[t],e}getTemplateElement(){const t=_.cloneNode();return t.innerHTML=function(t){const e=window,n=e.trustedTypes||e.TrustedTypes;return n&&!x&&(x=n.createPolicy("lit-html",{createHTML:t=>t})),x?x.createHTML(t):t}(this.getHTML()),t}}class N extends w{getHTML(){return `<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,n=e.firstChild;return e.removeChild(n),s(e,n.firstChild),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const E=t=>null===t||!("object"==typeof t||"function"==typeof t),P=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]),A=t=>t,T=(t,e,n)=>A;let M=T;const Y=document.createTextNode("");class X{constructor(t,e,n,o,s="attribute"){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];let i=o&&o.sanitizer;void 0===i&&(i=M(t,e,s),void 0!==o&&(o.sanitizer=i)),this.sanitizer=i;for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart();}_createPart(){return new S(this)}_getValue(){const t=this.strings,e=this.parts,n=t.length-1;if(1===n&&""===t[0]&&""===t[1]&&void 0!==e[0]){const t=e[0].value;if(!P(t))return t}let o="";for(let s=0;s<n;s++){o+=t[s];const n=e[s];if(void 0!==n){const t=n.value;if(E(t)||!P(t))o+="string"==typeof t?t:String(t);else for(const e of t)o+="string"==typeof e?e:String(e);}}return o+=t[n],o}commit(){if(this.dirty){this.dirty=!1;let t=this._getValue();t=this.sanitizer(t),"symbol"==typeof t&&(t=String(t)),this.element.setAttribute(this.name,t);}}}class S{constructor(t){this.value=void 0,this.committer=t;}setValue(t){t===r||E(t)&&t===this.value||(this.value=t,n(t)||(this.committer.dirty=!0));}commit(){for(;n(this.value);){const t=this.value;this.value=r,t.isClass?t.body(this):t(this);}this.value!==r&&this.committer.commit();}}class I{constructor(t,e){this.value=void 0,this.__pendingValue=void 0,this.textSanitizer=void 0,this.options=t,this.templatePart=e;}appendInto(t){this.startNode=t.appendChild(y()),this.endNode=t.appendChild(y());}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling;}appendIntoPart(t){t.__insert(this.startNode=y()),t.__insert(this.endNode=y());}insertAfterPart(t){t.__insert(this.startNode=y()),this.endNode=t.endNode,t.endNode=this.startNode;}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}const t=this.__pendingValue;t!==r&&(E(t)?t!==this.value&&this.__commitText(t):t instanceof w?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):P(t)?this.__commitIterable(t):t===a?(this.value=a,this.clear()):this.__commitText(t));}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode);}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t);}__commitText(t){const e=this.startNode.nextSibling;if(t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType){void 0===this.textSanitizer&&(this.textSanitizer=M(e,"data","property"));const n=this.textSanitizer(t);e.data="string"==typeof n?n:String(n);}else{const e=Y.cloneNode();this.__commitNode(e),void 0===this.textSanitizer&&(this.textSanitizer=M(e,"data","property"));const n=this.textSanitizer(t);e.data="string"==typeof n?n:String(n);}this.value=t;}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof g&&this.value.template===e)this.value.update(t.values);else{const n=this.endNode.parentNode;if(M!==T&&"STYLE"===n.nodeName||"SCRIPT"===n.nodeName)return void this.__commitText("/* lit-html will not write TemplateResults to scripts and styles */");const o=new g(e,t.processor,this.options),s=o._clone();o.update(t.values),this.__commitNode(s),this.value=o;}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,o=0;for(const s of t)n=e[o],void 0===n&&(n=new I(this.options,this.templatePart),e.push(n),0===o?n.appendIntoPart(this):n.insertAfterPart(e[o-1])),n.setValue(s),n.commit(),o++;o<e.length&&(e.length=o,this.clear(n&&n.endNode));}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode);}}class C{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n;}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r;}}class V extends X{constructor(t,e,n,o){super(t,e,n,o,"property"),this.single=2===n.length&&""===n[0]&&""===n[1];}_createPart(){return new L(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){if(this.dirty){this.dirty=!1;let t=this._getValue();t=this.sanitizer(t),this.element[this.name]=t;}}}class L extends S{}let k=!1;(()=>{try{const t={get capture(){return k=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t);}catch(t){}})();class D{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t);}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,o=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=null!=t&&(null==e||o);o&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=z(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r;}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t);}}const z=t=>t&&(k?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */class F{handleAttributeExpressions(t,e,n,o,s){const i=e[0];if("."===i){return new V(t,e.slice(1),n,s).parts}return "@"===i?[new D(t,e.slice(1),o.eventContext)]:"?"===i?[new C(t,e.slice(1),n)]:new X(t,e,n,s).parts}handleTextExpression(t,e){return new I(t,e)}}const B=new F;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function W(t){let e=$.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},$.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const o=t.strings.join(l);return n=e.keyString.get(o),void 0===n&&(n=new p(t,t.getTemplateElement()),e.keyString.set(o,n)),e.stringsArray.set(t.strings,n),n}const $=new Map,H=new WeakMap,R=(t,e,n)=>{let o=H.get(e);void 0===o&&(i(e,e.firstChild),H.set(e,o=new I(Object.assign({templateFactory:W},n),void 0)),o.appendInto(e)),o.setValue(t),o.commit();};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.5");const O=(t,...e)=>new w(t,e,"html",B),U=(t,...e)=>new N(t,e,"svg",B);var j=Object.freeze({__proto__:null,html:O,svg:U,DefaultTemplateProcessor:F,defaultTemplateProcessor:B,directive:t,Directive:e,isDirective:n,removeNodes:i,reparentNodes:s,noChange:r,nothing:a,AttributeCommitter:X,AttributePart:S,BooleanAttributePart:C,EventPart:D,isIterable:P,isPrimitive:E,NodePart:I,PropertyCommitter:V,PropertyPart:L,get sanitizerFactory(){return M},setSanitizerFactory:t=>{if(M!==T)throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");M=t;},parts:H,render:R,templateCaches:$,templateFactory:W,TemplateInstance:g,SVGTemplateResult:N,TemplateResult:w,createMarker:y,isTemplatePartActive:m,Template:p});
const mt=document.createElement("template");
class Nt{constructor(){this.isAction=!0;}}Nt.prototype.isAction=!0;const Et={element:document.createTextNode(""),axis:"xy",threshold:10,onDown(t){},onMove(t){},onUp(t){},onWheel(t){}};

/**
 * CalendarScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function CalendarScroll(options = {}) {
    let state, api, schedule;
    const defaultOptions = {
        speed: 1,
        hideScroll: false,
        onChange(time) { }
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    class CalendarScrollAction extends Nt {
        constructor(element) {
            super();
            this.isMoving = false;
            this.lastX = 0;
            this.onPointerStart = this.onPointerStart.bind(this);
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerEnd = this.onPointerEnd.bind(this);
            element.addEventListener('touchstart', this.onPointerStart);
            document.addEventListener('touchmove', this.onPointerMove);
            document.addEventListener('touchend', this.onPointerEnd);
            element.addEventListener('mousedown', this.onPointerStart);
            document.addEventListener('mousemove', this.onPointerMove);
            document.addEventListener('mouseup', this.onPointerEnd);
            element.style.cursor = 'move';
            const horizontalScroll = state.get('_internal.elements.horizontal-scroll');
            // @ts-ignore
            if (options.hideScroll && horizontalScroll) {
                horizontalScroll.style.visibility = 'hidden';
            }
        }
        onPointerStart(ev) {
            if (ev.type === 'mousedown' && ev.button !== 0)
                return;
            ev.stopPropagation();
            this.isMoving = true;
            const normalized = api.normalizePointerEvent(ev);
            this.lastX = normalized.x;
        }
        onPointerMove(ev) {
            schedule(() => {
                if (!this.isMoving)
                    return;
                const normalized = api.normalizePointerEvent(ev);
                const movedX = normalized.x - this.lastX;
                const time = state.get('_internal.chart.time');
                // @ts-ignore
                const movedTime = -Math.round(movedX * time.timePerPixel * options.speed);
                state.update('config.chart.time', configTime => {
                    if (configTime.from === 0)
                        configTime.from = time.from;
                    if (configTime.to === 0)
                        configTime.to = time.to;
                    configTime.from += movedTime;
                    configTime.to += movedTime;
                    // @ts-ignore
                    options.onChange(configTime);
                    return configTime;
                });
                this.lastX = normalized.x;
            })();
        }
        onPointerEnd() {
            this.isMoving = false;
            this.lastX = 0;
        }
        destroy(element, data) {
            element.removeEventListener('touchstart', this.onPointerStart);
            document.removeEventListener('touchmove', this.onPointerMove);
            document.removeEventListener('touchend', this.onPointerEnd);
            element.removeEventListener('mousedown', this.onPointerStart);
            document.removeEventListener('mousemove', this.onPointerMove);
            document.removeEventListener('mouseup', this.onPointerEnd);
        }
    }
    return function initialize(vido) {
        api = vido.api;
        state = vido.state;
        schedule = vido.schedule;
        state.update('config.actions.chart-calendar', actions => {
            actions.push(CalendarScrollAction);
            return actions;
        });
    };
}

var plugins = { ItemHold, ItemMovement, Selection, CalendarScroll };

export default plugins;
//# sourceMappingURL=plugins.js.map
