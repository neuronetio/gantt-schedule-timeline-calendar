/**
 * ListToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListToggle(vido, props = {}) {
  const { html, onDestroy, api, state, update } = vido;
  const componentName = 'list-toggle';
  let className;
  onDestroy(
    state.subscribe('config.classNames', classNames => {
      className = api.getClass(componentName);
    })
  );
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListToggle', ListToggleWrapper => (wrapper = ListToggleWrapper)));

  let iconsSrc = {
    open: '',
    close: ''
  };
  async function renderIcons() {
    const icons = state.get('config.list.toggle.icons');
    for (const iconName in icons) {
      const html = icons[iconName];
      iconsSrc[iconName] = await api.renderIcon(html);
    }
    update();
  }
  renderIcons();

  let open = true;
  onDestroy(
    state.subscribe('config.list.columns.percent', percent => (percent === 0 ? (open = false) : (open = true)))
  );

  function toggle(ev) {
    state.update('config.list.columns.percent', percent => {
      return percent === 0 ? 100 : 0;
    });
  }

  return templateProps =>
    wrapper(
      html`
        <div class=${className} @click=${toggle}><img src=${open ? iconsSrc.close : iconsSrc.open} /></div>
      `,
      { props, vido, templateProps }
    );
}
