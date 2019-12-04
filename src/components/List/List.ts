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

  async function renderIcons() {
    const icons = state.get('config.list.expander.icons');
    const rendered = {};
    for (const iconName in icons) {
      const html = icons[iconName];
      rendered[iconName] = await api.renderIcon(html);
    }
    state.update('_internal.list.expander.icons', rendered);
  }
  renderIcons();

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

  function onScroll(event) {
    event.stopPropagation();
    event.preventDefault();
    schedule(() => {
      if (event.type === 'scroll') {
        state.update('config.scroll.top', event.target.scrollTop);
      } else {
        const wheel = api.normalizeMouseWheelEvent(event);
        state.update('config.scroll.top', top => {
          return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
        });
      }
    })();
  }

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

  class ListAction {
    constructor(element) {
      state.update('_internal.elements.list', element);
      getWidth(element);
    }
    update(element) {
      return getWidth(element);
    }
  }
  componentActions.push(ListAction);

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
          : ''
      ),
      { vido, props: {}, templateProps }
    );
}
