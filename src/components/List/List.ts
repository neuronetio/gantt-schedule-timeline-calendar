import { Directive } from '../../../../lit-html/lit-html';

/**
 * List component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function List(vido, props = {}) {
  const { api, state, onDestroy, Actions, update, reuseComponents, html, schedule, StyleMap, cache } = vido;

  const componentName = 'list';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.List', value => (wrapper = value)));

  let ListColumnComponent;
  onDestroy(state.subscribe('config.components.ListColumn', value => (ListColumnComponent = value)));

  let className;
  let list, percent;
  function onListChange() {
    list = state.get('config.list');
    percent = list.columns.percent;
    update();
  }
  onDestroy(state.subscribe('config.list', onListChange));

  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { list });
      update();
    })
  );

  let listColumns = [];
  function onListColumnsDataChange(data) {
    reuseComponents(listColumns, Object.values(data), column => ({ columnId: column.id }), ListColumnComponent);
    update();
  }
  onDestroy(state.subscribe('config.list.columns.data;', onListColumnsDataChange));

  onDestroy(() => {
    listColumns.forEach(c => c.destroy());
  });
  const styleMap = new StyleMap({
    height: '',
    '--expander-padding-width': '',
    '--expander-size': ''
  });

  onDestroy(
    state.subscribeAll(['config.height', 'config.list.expander'], bulk => {
      const expander = state.get('config.list.expander');
      styleMap.style['height'] = state.get('config.height') + 'px';
      styleMap.style['--expander-padding-width'] = expander.padding + 'px';
      styleMap.style['--expander-size'] = expander.size + 'px';
      update();
    })
  );

  function onScrollHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.type === 'scroll') {
      state.update('config.scroll.top', event.target.scrollTop);
    } else {
      const wheel = api.normalizeMouseWheelEvent(event);
      state.update('config.scroll.top', top => {
        return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
      });
    }
  }

  const onScroll = {
    handleEvent: schedule(onScrollHandler),
    passive: false
  };

  let width;
  function getWidth(element) {
    if (!width) {
      width = element.clientWidth;
      if (percent === 0) {
        width = 0;
      }
      state.update('_internal.list.width', width);
    }
  }

  let moving = '',
    initialX = 0,
    initialY = 0,
    lastY = 0,
    lastX = 0;

  function onPointerStart(ev) {
    if (ev.type === 'mousedown' && ev.button !== 0) return;
    ev.stopPropagation();
    moving = 'xy';
    const normalized = api.normalizePointerEvent(ev);
    lastX = normalized.x;
    lastY = normalized.y;
    initialX = normalized.x;
    initialY = normalized.y;
  }

  function handleX(normalized) {
    let movementX = normalized.x - lastX;
    state.update('config.list.columns.percent', percent => {
      percent += movementX;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      return percent;
    });
    lastY = normalized.y;
    lastX = normalized.x;
  }

  function handleY(normalized) {
    let movementY = normalized.y - lastY;
    movementY *= state.get('config.scroll.yMultiplier');
    if (Math.abs(normalized.y - initialY) < 10) return;
    state.update('config.scroll.top', top => {
      top -= movementY;
      top = api.limitScroll('top', top);
      return top;
    });
    lastY = normalized.y;
    lastX = normalized.x;
  }

  function onPointerMove(ev) {
    ev.stopPropagation();
    schedule(() => {
      if (moving === '' || (ev.type === 'mousemove' && ev.button !== 0)) return;
      const normalized = api.normalizePointerEvent(ev);
      if (moving === 'x' || (moving === 'xy' && Math.abs(normalized.x - initialX) > 10)) {
        moving = 'x';
        return handleX(normalized);
      }
      if (moving === 'y' || (moving === 'xy' && Math.abs(normalized.y - initialY) > 10)) {
        moving = 'y';
        return handleY(normalized);
      }
    })();
  }

  function onPointerEnd(ev) {
    moving = '';
    lastY = 0;
    lastX = 0;
  }

  class ListAction {
    constructor(element) {
      state.update('_internal.elements.list', element);
      element.addEventListener('touchstart', onPointerStart);
      document.addEventListener('touchmove', onPointerMove);
      document.addEventListener('touchend', onPointerEnd);
      element.addEventListener('mousedown', onPointerStart);
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerEnd);
      getWidth(element);
    }
    update(element) {
      return getWidth(element);
    }
    destroy(element) {
      element.removeEventListener('touchstart', onPointerStart);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerEnd);
      element.removeEventListener('mousedown', onPointerStart);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerEnd);
    }
  }
  if (!componentActions.includes(ListAction)) {
    componentActions.push(ListAction);
  }

  const actions = Actions.create(componentActions, { ...props, api, state });

  return templateProps =>
    wrapper(
      cache(
        list.columns.percent > 0
          ? html`
              <div class=${className} data-actions=${actions} style=${styleMap} @scroll=${onScroll} @wheel=${onScroll}>
                ${listColumns.map(c => c.html())}
              </div>
            `
          : null
      ),
      { vido, props: {}, templateProps }
    );
}
