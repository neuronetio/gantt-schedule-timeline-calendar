/**
 * ItemHold plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export interface Options {
  time?: number;
  movementThreshold?: number;
  action?: (element: HTMLElement, data: any) => void;
}

export default function ItemHold(options: Options = {}) {
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
