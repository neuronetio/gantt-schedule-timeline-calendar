/**
 * ListColumn component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ListColumn(vido, props) {
  const { api, state, onDestroy, actions, update, createComponent, reuseComponents, html, styleMap } = vido;

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumn', value => (wrapper = value)));

  let ListColumnRowComponent;
  onDestroy(state.subscribe('config.components.ListColumnRow', value => (ListColumnRowComponent = value)));
  let ListColumnHeaderComponent;
  onDestroy(state.subscribe('config.components.ListColumnHeader', value => (ListColumnHeaderComponent = value)));

  let column,
    columnPath = `config.list.columns.data.${props.columnId}`;
  onDestroy(
    state.subscribe(columnPath, function columnChanged(val) {
      column = val;
      update();
    })
  );

  const componentName = 'list-column';
  const rowsComponentName = componentName + '-rows';
  const componentActions = api.getActions(componentName);
  const rowsActions = api.getActions(rowsComponentName);
  let className,
    classNameContainer,
    calculatedWidth,
    widthStyle = { width: '' },
    styleContainer = { width: '', height: '' },
    styleScrollCompensation = { width: '', height: '', transform: '' };

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      classNameContainer = api.getClass(rowsComponentName, { column });
      update();
    })
  );
  let width;
  const calculateStyle = () => {
    const list = state.get('config.list');
    const compensation = state.get('config.scroll.compensation');
    calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
    width = calculatedWidth + list.columns.resizer.width;
    const height = state.get('_internal.height');
    widthStyle.width = width + 'px';
    styleContainer.width = width + 'px';
    styleContainer.height = height + 'px';
    styleScrollCompensation.width = width + 'px';
    styleScrollCompensation.height = height + 'px';
    styleScrollCompensation.transform = ` translate(0px, ${compensation}px)`;
  };
  onDestroy(
    state.subscribeAll(
      [
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        '_internal.chart.dimensions.width',
        '_internal.height',
        'config.scroll.compensation'
      ],
      calculateStyle,
      { bulk: true }
    )
  );

  let visibleRows = [];
  const visibleRowsChange = val => {
    reuseComponents(
      visibleRows,
      val,
      row => row && { columnId: props.columnId, rowId: row.id, width },
      ListColumnRowComponent
    );
    update();
  };
  onDestroy(state.subscribe('_internal.list.visibleRows;', visibleRowsChange));

  onDestroy(function rowsDestroy() {
    visibleRows.forEach(row => row.destroy());
  });

  const ListColumnHeader = createComponent(ListColumnHeaderComponent, { columnId: props.columnId });
  onDestroy(ListColumnHeader.destroy);

  function getRowHtml(row) {
    return row.html();
  }
  return templateProps =>
    wrapper(
      html`
        <div
          class=${className}
          data-actions=${actions(componentActions, { column, state: state, api: api })}
          style=${styleMap(widthStyle)}
        >
          ${ListColumnHeader.html()}
          <div
            class=${classNameContainer}
            style=${styleMap(styleContainer)}
            data-actions=${actions(rowsActions, { api, state })}
          >
            <div class=${classNameContainer + '--scroll-compensation'} style=${styleMap(styleScrollCompensation)}>
              ${visibleRows.map(getRowHtml)}
            </div>
          </div>
        </div>
      `,
      { vido, props, templateProps }
    );
}
