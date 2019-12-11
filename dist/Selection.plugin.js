(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Selection = factory());
}(this, (function () { 'use strict';

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
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.3');
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
        class SelectionAction extends Action {
            /**
             * Selection action constructor
             * @param {Element} element
             * @param {object|any} data
             */
            constructor(element, data) {
                super();
                let previousSelect, api = {};
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
                        if (rowsWithBlocks)
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
                    if (!all)
                        return [];
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
                        if (elements[type + 's'])
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
                        if (rowsWithBlocks)
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

    return Selection;

})));
//# sourceMappingURL=Selection.plugin.js.map
