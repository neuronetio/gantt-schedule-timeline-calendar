(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.WeekendHighlight = factory());
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
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
        // If we run in the browser set version
        (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.7');
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
     * Weekend highlight plugin
     *
     * @copyright Rafal Pospiech <https://neuronet.io>
     * @author    Rafal Pospiech <neuronet.io@gmail.com>
     * @package   gantt-schedule-timeline-calendar
     * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
     * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
     */
    function WeekendHiglight(options = {}) {
        const weekdays = options.weekdays || [6, 0];
        let className;
        let api;
        let enabled = true;
        class WeekendHighlightAction extends Action {
            constructor(element, data) {
                super();
                this.highlight(element, data.time.leftGlobal);
            }
            update(element, data) {
                this.highlight(element, data.time.leftGlobal);
            }
            highlight(element, time) {
                const hasClass = element.classList.contains(className);
                if (!enabled) {
                    if (hasClass) {
                        element.classList.remove(className);
                    }
                    return;
                }
                const isWeekend = weekdays.includes(api.time.date(time).day());
                if (!hasClass && isWeekend) {
                    element.classList.add(className);
                }
                else if (hasClass && !isWeekend) {
                    element.classList.remove(className);
                }
            }
        }
        return function initialize(vido) {
            api = vido.api;
            className = options.className || api.getClass('chart-timeline-grid-row-block') + '--weekend';
            const destroy = vido.state.subscribe('_internal.chart.time.format.period', period => (enabled = period === 'day'));
            vido.state.update('config.actions.chart-timeline-grid-row-block', actions => {
                actions.push(WeekendHighlightAction);
                return actions;
            });
            return function onDestroy() {
                destroy();
            };
        };
    }

    return WeekendHiglight;

})));
//# sourceMappingURL=WeekendHighlight.plugin.js.map
