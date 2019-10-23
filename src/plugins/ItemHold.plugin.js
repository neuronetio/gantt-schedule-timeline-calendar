/**
 * ItemsHold plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ItemHold(options = {}) {
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
      destroy(element, data) {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mousedown', elementMouseDown);
      }
    };
  }

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-timeline-items-row-item', actions => {
      actions.push(action);
      return actions;
    });
  };
}
