/**
 * ListToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListToggle(vido, props) {
  const { api, state, onDestroy, actions, update, html, unsafeHTML, onChange } = vido;
  const componentName = 'list-expander-toggle';

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListToggle', value => (wrapper = value)));

  const componentActions = api.getActions(componentName);
  let className, style;
  let classNameChild, classNameOpen, classNameClosed;
  let expanded = false;
  let iconChild, iconOpen, iconClosed;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameChild = api.getClass(componentName + '-child');
      classNameOpen = api.getClass(componentName + '-open');
      classNameClosed = api.getClass(componentName + '-closed');
      update();
    })
  );
  onDestroy(
    state.subscribe('config.list.expander.icons', () => {
      const expander = state.get('config.list.expander');
      iconChild = expander.icons.child;
      iconOpen = expander.icons.open;
      iconClosed = expander.icons.closed;
      update();
    })
  );

  if (props.row) {
    function expandedChange(isExpanded) {
      expanded = isExpanded;
      update();
    }
    let expandedSub;
    function onPropsChange(changedProps) {
      props = changedProps;
      if (expandedSub) expandedSub();
      expandedSub = state.subscribe(`config.list.rows.${props.row.id}.expanded`, expandedChange);
    }
    onChange(onPropsChange);
    onDestroy(function listToggleDestroy() {
      if (expandedSub) expandedSub();
    });
  } else {
    function expandedChange(bulk) {
      for (const rowExpanded of bulk) {
        if (rowExpanded.value) {
          expanded = true;
          break;
        }
      }
      update();
    }
    onDestroy(state.subscribe('config.list.rows.*.expanded', expandedChange, { bulk: true }));
  }

  function toggle() {
    expanded = !expanded;
    if (props.row) {
      state.update(`config.list.rows.${props.row.id}.expanded`, expanded);
    } else {
      state.update(
        `config.list.rows`,
        rows => {
          for (const rowId in rows) {
            rows[rowId].expanded = expanded;
          }
          return rows;
        },
        { only: ['*.expanded'] }
      );
    }
  }

  const getIcon = () => {
    if (props.row?._internal?.children?.length === 0) {
      return html`
        <div class=${classNameChild}>
          ${unsafeHTML(iconChild)}
        </div>
      `;
    }
    return expanded
      ? html`
          <div class=${classNameOpen}>
            ${unsafeHTML(iconOpen)}
          </div>
        `
      : html`
          <div class=${classNameClosed}>
            ${unsafeHTML(iconClosed)}
          </div>
        `;
  };

  const actionProps = { row: props.row, api, state };
  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-actions=${actions(componentActions, actionProps)} @click=${toggle}>
          ${getIcon()}
        </div>
      `,
      { vido, props, templateProps }
    );
}
