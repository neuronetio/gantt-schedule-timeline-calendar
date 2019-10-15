/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */

import ListColumnRow from './ListColumnRow';
import ListColumnHeaderComponent from './ListColumnHeader';

export default function ListColumnComponent({ columnId }, vido) {
  const { api, state, onDestroy, actions, update, createComponent, html, repeat } = vido;

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(
    state.subscribe(columnPath, val => {
      column = val;
      update();
    })
  );

  const componentName = 'list-column';
  const rowsComponentName = componentName + '-rows';
  const componentActions = api.getActions(componentName);
  const rowsActions = api.getActions(rowsComponentName);
  let className, classNameContainer, calculatedWidth, width, styleContainer;

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      classNameContainer = api.getClass(rowsComponentName, { column });
      update();
    })
  );

  let visibleRows = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows;', val => {
      visibleRows.forEach(row => row.component.destroy());
      visibleRows = val.map(row => ({
        id: row.id,
        component: createComponent(ListColumnRow, { columnId, rowId: row.id })
      }));
      update();
    })
  );

  onDestroy(() => {
    visibleRows.forEach(row => row.component.destroy());
  });

  onDestroy(
    state.subscribeAll(
      [
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        'config.height',
        'config.headerHeight'
      ],
      bulk => {
        const list = state.get('config.list');
        calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
        width = `width: ${calculatedWidth + list.columns.resizer.width}px`;
        styleContainer = `height: ${state.get('config.height')}px`;
      },
      { bulk: true }
    )
  );

  const ListColumnHeader = createComponent(ListColumnHeaderComponent, { columnId });
  onDestroy(ListColumnHeader.destroy);

  return props => html`
    <div
      class=${className}
      data-actions=${actions(componentActions, { column, state: state, api: api })}
      style=${width}
    >
      ${ListColumnHeader.html()}
      <div class=${classNameContainer} style=${styleContainer} data-actions=${actions(rowsActions, { api, state })}>
        ${visibleRows.map(row => row.component.html())}
      </div>
    </div>
  `;
}
