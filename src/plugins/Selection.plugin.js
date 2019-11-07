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
  const defaultOptions = {
    style: {},
    grid: false,
    items: true,
    rows: false
  };
  options = { ...options, ...defaultOptions };
  let state, api;
  let chartTimeline, top, left;
  let selecting = { fromX: -1, fromY: -1, toX: -1, toY: -1, startX: -1, startY: -1 };
  const path = 'config.plugins.selection';
  const rectClassName = 'gantt-schedule-timeline-caledar__plugin-selection-rect';
  const rect = document.createElement('div');
  rect.classList.add(rectClassName);
  rect.style.visibility = 'hidden';
  rect.style.left = '0px';
  rect.style.top = '0px';
  rect.style.width = '0px';
  rect.style.height = '0px';
  rect.style.background = 'rgba(0, 119, 192,0.2)';
  rect.style.border = '2px dashed rgba(0, 119, 192,1)';
  rect.style.position = 'absolute';
  rect.style['user-select'] = 'none';
  rect.style['pointer-events'] = 'none';
  for (const styleProp in options.style) {
    rect.style[styleProp] = options.style[styleProp];
  }

  function rectSelectionAction(element, data) {
    chartTimeline = state.get('_internal.elements.chart-timeline');
    if (!chartTimeline.querySelector('.' + rectClassName)) {
      chartTimeline.insertAdjacentElement('beforeend', rect);
      const bounding = chartTimeline.getBoundingClientRect();
      left = bounding.left;
      top = bounding.top;
    }

    function mouseDown(ev) {
      if (ev.button !== 0) {
        return;
      }
      selecting.fromX = ev.x - left;
      selecting.fromY = ev.y - top;
      selecting.startX = selecting.fromX;
      selecting.startY = selecting.fromY;
    }

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

    function mouseMove(ev) {
      if (selecting.fromX === -1 && selecting.fromY === -1) {
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
      if (!state.get(`${path}.selecting`)) state.update(`${path}.selecting`, true);
    }

    function mouseUp(ev) {
      if (selecting.fromX !== -1 && selecting.fromY !== -1) {
        ev.stopPropagation();
      }
      selecting.fromX = -1;
      selecting.fromY = -1;
      selecting.startX = -1;
      selecting.startY = -1;
      rect.style.visibility = 'hidden';
      if (state.get(`${path}.selecting`)) state.update(`${path}.selecting`, false);
    }

    element.addEventListener('mousedown', mouseDown);
    document.body.addEventListener('mousemove', schedule(mouseMove));
    document.body.addEventListener('mouseup', mouseUp);
    return {
      update(element, changedData) {
        data = changedData;
      },
      destroy() {
        document.body.removeEventListener('mouseup', mouseUp);
        document.body.removeEventListener('mousemove', mouseMove);
        element.removeEventListener('mousedown', mouseDown);
      }
    };
  }

  return function initialize(State, Api) {
    state = State;
    api = Api;
    if (typeof state.get(path) === 'undefined') {
      state.update(path, {
        selecting: false,
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
  };
}
