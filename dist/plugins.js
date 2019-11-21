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
    const defaultOptions = {
        time: 1000,
        movementThreshold: 2,
        action(element, data) { }
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    const holding = {};
    const mouse = { x: 0, y: 0 };
    function onMouseDown(item, element, event) {
        if (typeof holding[item.id] === 'undefined') {
            holding[item.id] = { x: event.x, y: event.y };
            setTimeout(() => {
                if (typeof holding[item.id] !== 'undefined') {
                    let exec = true;
                    const xMovement = Math.abs(holding[item.id].x - mouse.x);
                    const yMovement = Math.abs(holding[item.id].y - mouse.y);
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
    function action(element, data) {
        function elementMouseDown(event) {
            onMouseDown(data.item, element, event);
        }
        element.addEventListener('mousedown', elementMouseDown);
        function mouseUp() {
            onMouseUp(data.item.id);
        }
        document.addEventListener('mouseup', mouseUp);
        function onMouseMove(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        }
        document.addEventListener('mousemove', onMouseMove);
        return {
            update(element, changedData) {
                data = changedData;
            },
            destroy(element, data) {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
                element.removeEventListener('mousedown', elementMouseDown);
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
        snapStart(timeStart, startDiff) {
            return timeStart + startDiff;
        },
        snapEnd(timeEnd, endDiff) {
            return timeEnd + endDiff;
        },
        ghostNode: true
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    const movementState = {};
    /**
     * Add moving functionality to items as action
     *
     * @param {HTMLElement} node DOM Node
     * @param {Object} data
     */
    function action(element, data) {
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
            const compensation = state.get('config.scroll.compensation');
            ghost.style.position = 'absolute';
            ghost.style.left = ev.x - ganttLeft - movement.itemLeftCompensation + 'px';
            const itemTop = ev.y - ganttTop - element.offsetTop - compensation + parseInt(style['margin-top']);
            movement.itemTop = itemTop;
            ghost.style.top = ev.y - ganttTop - itemTop + 'px';
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
        function moveGhost(data, ev) {
            if (options.ghostNode) {
                const movement = getMovement(data);
                const left = ev.x - movement.ganttLeft - movement.itemLeftCompensation;
                movement.ghost.style.left = left + 'px';
                movement.ghost.style.top =
                    ev.y - movement.ganttTop - movement.itemTop + parseInt(getComputedStyle(element)['margin-top']) + 'px';
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
        state = data.state;
        api = data.api;
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
        function labelMouseDown(ev) {
            ev.stopPropagation();
            if (ev.button !== 0) {
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
                if (!isResizeable(data) && resizerEl.style.visibility === 'visible') {
                    resizerEl.style.visibility = 'hidden';
                }
                else if (isResizeable(data) && resizerEl.style.visibility === 'hidden') {
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

/**
 * SaveAsImage plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
// @ts-nocheck
function SaveAsImage(options = {}) {
    const defaultOptions = {
        style: 'font-family: sans-serif;',
        filename: 'gantt-schedule-timeline-calendar.jpeg'
    };
    options = Object.assign(Object.assign({}, defaultOptions), { options });
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
    return function initialize(vido) {
        vido.state.subscribe('_internal.elements.main', main => {
            if (main) {
                main.addEventListener('save-as-image', saveAsImage);
            }
        });
    };
}

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
    let selecting = {
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
    /**
     * Selection action class
     */
    class SelectionAction {
        /**
         * Selection action constructor
         * @param {Element} element
         * @param {object|any} data
         */
        constructor(element, data) {
            let previousSelect, api = {};
            this.chartTimeline = state.get('_internal.elements.chart-timeline');
            if (!this.chartTimeline.querySelector('.' + rectClassName)) {
                this.chartTimeline.insertAdjacentElement('beforeend', rect);
                const bounding = this.chartTimeline.getBoundingClientRect();
                this.left = bounding.left;
                this.top = bounding.top;
            }
            /**
             * Clear selection
             * @param {boolean} force
             */
            function clearSelection(force = false) {
                let selectingState;
                state.update(path, currently => {
                    selectingState = {
                        selecting: {
                            'chart-timeline-grid-rows': [],
                            'chart-timeline-grid-row-blocks': [],
                            'chart-timeline-items-rows': [],
                            'chart-timeline-items-row-items': []
                        },
                        selected: {
                            'chart-timeline-grid-rows': force
                                ? []
                                : options.canDeselect('chart-timeline-grid-rows', currently.selected['chart-timeline-grid-rows'], currently),
                            'chart-timeline-grid-row-blocks': force
                                ? []
                                : options.canDeselect('chart-timeline-grid-row-blocks', currently.selected['chart-timeline-grid-row-blocks'], currently),
                            'chart-timeline-items-rows': force
                                ? []
                                : options.canDeselect('chart-timeline-items-rows', currently.selected['chart-timeline-items-rows'], currently),
                            'chart-timeline-items-row-items': force
                                ? []
                                : options.canDeselect('chart-timeline-items-rows', currently.selected['chart-timeline-items-rows'], currently)
                        }
                    };
                    return selectingState;
                });
                state.update('_internal.chart.grid.rowsWithBlocks', function clearRowsWithBlocks(rowsWithBlocks) {
                    for (const row of rowsWithBlocks) {
                        for (const block of row.blocks) {
                            block.selected = selectingState.selected['chart-timeline-grid-row-blocks'].includes(block.id);
                            block.selecting = false;
                        }
                    }
                    return rowsWithBlocks;
                });
            }
            api.clearSelection = clearSelection;
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
                const currentAll = state.get(path);
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
            const select = ev => {
                if (!selecting.selecting) {
                    return;
                }
                clearSelection();
                saveAndSwapIfNeeded(ev);
                rect.style.left = selecting.fromX + 'px';
                rect.style.top = selecting.fromY + 'px';
                rect.style.visibility = 'visible';
                rect.style.width = selecting.toX - selecting.fromX + 'px';
                rect.style.height = selecting.toY - selecting.fromY + 'px';
                const rectBoundingRect = rect.getBoundingClientRect();
                const elements = state.get('_internal.elements');
                const nowSelecting = {};
                for (const type in selectionTypesIdGetters) {
                    nowSelecting[type + 's'] = getSelecting(rectBoundingRect, elements, type, selectionTypesIdGetters[type]);
                }
                state.update(`${path}.selecting`, nowSelecting);
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
            };
            /**
             * End select
             * @param {Event} ev
             */
            const endSelect = ev => {
                if (selecting.selecting) {
                    ev.stopPropagation();
                    if (selecting.fromX === ev.x - this.left && selecting.fromY === ev.y - this.top) {
                        selecting.selecting = false;
                        rect.style.visibility = 'hidden';
                        return;
                    }
                }
                else {
                    clearSelection();
                    return;
                }
                selecting.selecting = false;
                rect.style.visibility = 'hidden';
                const currentSelect = state.get(path);
                const select = {};
                state.update(path, value => {
                    select.selected = Object.assign({}, value.selecting);
                    select.selecting = {
                        'chart-timeline-grid-rows': [],
                        'chart-timeline-grid-row-blocks': [],
                        'chart-timeline-items-rows': [],
                        'chart-timeline-items-row-items': []
                    };
                    return select;
                });
                const elements = state.get('_internal.elements');
                for (const type in selectionTypesIdGetters) {
                    for (const element of elements[type + 's']) {
                        if (currentSelect.selecting[type + 's'].includes(element.vido.id)) {
                            options.deselecting(element.vido, type);
                        }
                    }
                }
                state.update('config.chart.items', function updateItems(items) {
                    const now = currentSelect.selecting['chart-timeline-items-row-items'];
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
                });
                state.update('_internal.chart.grid.rowsWithBlocks', function updateRowsWithBlocks(rowsWithBlocks) {
                    for (const row of rowsWithBlocks) {
                        for (const block of row.blocks) {
                            if (currentSelect.selecting['chart-timeline-grid-row-blocks'].includes(block.id)) {
                                if (typeof block.selected === 'undefined' || !block.selected) {
                                    options.selected(block, 'chart-timeline-grid-row-block');
                                }
                                block.selected = true;
                            }
                            else {
                                if (previousSelect.selected['chart-timeline-grid-row-blocks'].includes(block.id)) {
                                    options.deselected(block, 'chart-timeline-grid-row-block');
                                }
                                block.selected = false;
                            }
                        }
                    }
                    return rowsWithBlocks;
                });
            };
            /**
             * Mouse down event handler
             * @param {MouseEvent} ev
             */
            this.mouseDown = ev => {
                if (ev.button !== 0) {
                    return;
                }
                selecting.selecting = true;
                selecting.fromX = ev.x - this.left;
                selecting.fromY = ev.y - this.top;
                selecting.startX = selecting.fromX;
                selecting.startY = selecting.fromY;
                previousSelect = cloneSelection(state.get(path));
                clearSelection();
            };
            /**
             * Mouse move event handler
             * @param {MouseEvent} ev
             */
            this.mouseMove = ev => {
                select(ev);
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
        update() {
            const bounding = this.chartTimeline.getBoundingClientRect();
            this.left = bounding.left;
            this.top = bounding.top;
        }
        destroy(element) {
            document.removeEventListener('mouseup', this.mouseUp);
            document.removeEventListener('mousemove', this.mouseMove);
            element.removeEventListener('mousedown', this.mouseDown);
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
    class GridBlockAction {
        constructor(element, data) {
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
    class ItemAction {
        constructor(element, data) {
            this.classNameSelecting = api.getClass('chart-timeline-items-row-item') + '--selecting';
            this.classNameSelected = api.getClass('chart-timeline-items-row-item') + '--selected';
            updateSelection(element, data.item.selecting, data.item.selected, this.classNameSelecting, this.classNameSelected);
        }
        update(element, data) {
            updateSelection(element, data.item.selecting, data.item.selected, this.classNameSelecting, this.classNameSelected);
        }
        destroy(element, data) {
            element.classList.remove(this.classNameSelecting);
            element.classList.remove(this.classNameSelected);
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
        state.update('config.chart.items', items => {
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
 * CalendarScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function CalendarScroll(options = {}) {
    let state, api;
    const defaultOptions = {
        speed: 1,
        hideScroll: false,
        onChange(time) { }
    };
    options = Object.assign(Object.assign({}, defaultOptions), options);
    class CalendarScrollAction {
        constructor(element, data) {
            this.isMoving = false;
            this.lastX = 0;
            this.onPanStart = this.onPanStart.bind(this);
            this.onPanMove = this.onPanMove.bind(this);
            this.onPanEnd = this.onPanEnd.bind(this);
            this.mc = new api.Hammer(element);
            this.mc.on('panstart', this.onPanStart);
            this.mc.on('panmove', this.onPanMove);
            this.mc.on('panend', this.onPanEnd);
            element.style.cursor = 'move';
            const horizontalScroll = state.get('_internal.elements.horizontal-scroll');
            // @ts-ignore
            if (options.hideScroll && horizontalScroll) {
                horizontalScroll.style.visibility = 'hidden';
            }
        }
        onPanStart(ev) {
            this.isMoving = true;
            this.lastX = ev.deltaX;
        }
        onPanMove(ev) {
            const movedX = ev.deltaX - this.lastX;
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
            this.lastX = ev.deltaX;
        }
        onPanEnd(ev) {
            this.isMoving = false;
            this.lastX = 0;
        }
        destroy(element, data) {
            this.mc.off(element);
        }
    }
    return function initialize(vido) {
        api = vido.api;
        state = vido.state;
        state.update('config.actions.chart-calendar', actions => {
            actions.push(CalendarScrollAction);
            return actions;
        });
    };
}

var plugins = { ItemHold, ItemMovement, SaveAsImage, Selection, CalendarScroll };

export default plugins;
//# sourceMappingURL=plugins.js.map
