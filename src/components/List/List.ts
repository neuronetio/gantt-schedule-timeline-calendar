/**
 * List component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function List(vido) {
  const { api, state, onDestroy, actions, update, reuseComponents, html } = vido;

  const componentName = 'list';
  const componentActions = api.getActions(componentName);

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.List', value => (wrapper = value)));

  let ListColumnComponent;
  onDestroy(state.subscribe('config.components.ListColumn', value => (ListColumnComponent = value)));

  let className;
  let list, percent;
  onDestroy(
    state.subscribe('config.list', () => {
      list = state.get('config.list');
      percent = list.columns.percent;
      update();
    })
  );

  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, { list });
      update();
    })
  );

  let listColumns = [];
  onDestroy(
    state.subscribe('config.list.columns.data;', data => {
      reuseComponents(listColumns, Object.values(data), column => ({ columnId: column.id }), ListColumnComponent);
      update();
    })
  );

  onDestroy(() => {
    listColumns.forEach(c => c.destroy());
  });

  let style = '';
  onDestroy(
    state.subscribe('config.height', height => {
      style = `height: ${height}px`;
      update();
    })
  );

  const onScroll = {
    handleEvent(event) {
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
    },
    passive: false,
    capture: true
  };

  let width;
  function getWidth(element) {
    if (!width) {
      width = element.clientWidth;
      if (percent === 0) {
        width = 0;
      }
      state.update('_internal.list.width', width);
      state.update('_internal.elements.list', element);
    }
  }

  componentActions.push(element => {
    state.update('_internal.elements.list', element);
    getWidth(element);
    return {
      update: getWidth
    };
  });

  return props =>
    wrapper(
      list.columns.percent > 0
        ? html`
            <div
              class=${className}
              data-actions=${actions(componentActions)}
              style=${style}
              @scroll=${onScroll}
              @wheel=${onScroll}
            >
              ${listColumns.map(c => c.html())}
            </div>
          `
        : null,
      { vido, props: {}, templateProps: props }
    );
}
