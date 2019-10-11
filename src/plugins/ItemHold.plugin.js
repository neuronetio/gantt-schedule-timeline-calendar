export default function ItemHoldPlugin(options = {}) {
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

  const action = {
    create(element, data) {
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
    },
    destroy() {
      mouseUps.forEach(mouseUp => document.removeEventListener('mouseup', mouseUp));
      mouseMoves.forEach(mouseMove => document.removeEventListener('mousemove', mouseMove));
    }
  };

  return function initializePlugin(state, api) {
    state.update('config.actions.chart-gantt-items-row-item', actions => {
      actions.push(action);
      return actions;
    });
  };
}
