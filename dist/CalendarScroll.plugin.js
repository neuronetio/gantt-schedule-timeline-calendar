(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.CalendarScroll = factory());
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
        class CalendarScrollAction extends Action {
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

    return CalendarScroll;

})));
//# sourceMappingURL=CalendarScroll.plugin.js.map
