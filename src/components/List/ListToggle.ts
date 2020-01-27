/**
 * ListToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
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

  let toggleIconsSrc = {
    open: '',
    close: ''
  };
  onDestroy(
    state.subscribe('_internal.list.toggle.icons', value => {
      if (value) {
        toggleIconsSrc = value;
        update();
      }
    })
  );

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
        <div class=${className} @click=${toggle}><img src=${open ? toggleIconsSrc.close : toggleIconsSrc.open} /></div>
      `,
      { props, vido, templateProps }
    );
}
