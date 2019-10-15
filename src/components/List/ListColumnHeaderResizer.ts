/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

export default function ListColumnHeaderResizer({ columnId }, vido) {
  const { api, state, onDestroy, update, html, actions } = vido;

  const componentName = 'list-column-header-resizer';
  const componentActions = api.getActions(componentName);

  let column;
  onDestroy(
    state.subscribe(`config.list.columns.data.${columnId}`, val => {
      column = val;
      update();
    })
  );

  let className, containerClass, dotsClass, dotClass, lineClass, calculatedWidth, width, dotsWidth;
  let inRealTime = false;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      containerClass = api.getClass(componentName + '-container', { column });
      dotsClass = api.getClass(componentName + '-dots', { column });
      dotClass = api.getClass(componentName + '-dots-dot', { column });
      lineClass = api.getClass(componentName + '-line', { column });
      update();
    })
  );
  onDestroy(
    state.subscribeAll(
      [
        `config.list.columns.data.${column.id}.width`,
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        'config.list.columns.resizer.inRealTime'
      ],
      (value, path) => {
        const list = state.get('config.list');
        calculatedWidth = column.width * list.columns.percent * 0.01;
        width = 'width:' + calculatedWidth + 'px';
        dotsWidth = `width: ${list.columns.resizer.width}px`;
        inRealTime = list.columns.resizer.inRealTime;
        update();
      }
    )
  );

  let dots = [1, 2, 3, 4, 5, 6, 7, 8];
  onDestroy(
    state.subscribe('config.list.columns.resizer.dots', value => {
      dots = [];
      for (let i = 0; i < value; i++) {
        dots.push(i);
      }
      update();
    })
  );

  let isMoving = false;
  let left = calculatedWidth;
  let lineStyle = `--display: none; --left: ${left}px;`;
  const columnWidthPath = `config.list.columns.data.${column.id}.width`;

  function onMouseDown(event) {
    isMoving = true;
    state.update('_internal.list.columns.resizer.active', true);
    if (isMoving) {
      lineStyle = `--display:block; --left: ${left}px;`;
    } else {
      lineStyle = `--display:none; --left: 0px;`;
    }
  }

  function onMouseMove(event) {
    if (isMoving) {
      left += event.movementX;
      if (left < 0) {
        left = 0;
      }
      if (inRealTime) {
        state.update(columnWidthPath, left);
      }
    }
  }

  function onMouseUp(event) {
    if (isMoving) {
      state.update('_internal.list.columns.resizer.active', false);
      state.update(columnWidthPath, left);
      isMoving = false;
    }
  }

  document.body.addEventListener('mousemove', onMouseMove);
  onDestroy(() => document.body.removeEventListener('mousemove', onMouseMove));
  document.body.addEventListener('mouseup', onMouseUp);
  onDestroy(() => document.body.removeEventListener('mouseup', onMouseUp));

  return props => html`
    <div class=${className} data-actions=${actions(componentActions, { column, api, state })}>
      <div class=${containerClass}>
        ${column.header.html
          ? html`
              ${column.header.html}
            `
          : column.header.content}
      </div>
      <div class=${dotsClass} style=${'--' + dotsWidth} @mousedown=${onMouseDown}>
        ${dots.map(
          dot =>
            html`
              <div class=${dotClass} />
            `
        )}
      </div>
    </div>
  `;
}
