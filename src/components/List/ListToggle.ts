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
  const { api, state, onDestroy, actions, update, html, onChange, cache } = vido;
  const componentName = 'list-expander-toggle';

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListToggle', value => (wrapper = value)));

  const componentActions = api.getActions(componentName);
  let className, classNameChild, classNameOpen, classNameClosed;
  let expanded = false;
  let iconChild, iconOpen, iconClosed;
  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName);
      classNameChild = className + '-child';
      classNameOpen = className + '-open';
      classNameClosed = className + '-closed';
      update();
    })
  );
  onDestroy(
    state.subscribe('_internal.list.expander.icons', icons => {
      if (icons) {
        iconChild = icons.child;
        iconOpen = icons.open;
        iconClosed = icons.closed;
      }
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

  const actionProps = { row: props.row, api, state };
  const getIcon = () => {
    if (iconChild) {
      if (props.row?._internal?.children?.length === 0) {
        return html`
          <img class=${classNameChild} src=${iconChild} />
        `;
      }
      return expanded
        ? html`
            <img class=${classNameOpen} src=${iconOpen} />
          `
        : html`
            <img class=${classNameClosed} src=${iconClosed} />
          `;
    }
    return '';
  };
  return templateProps =>
    wrapper(
      html`
        <div class=${className} data-action=${actions(componentActions, actionProps)} @click=${toggle}>
          ${cache(getIcon())}
        </div>
      `,
      { vido, props, templateProps }
    );
}
