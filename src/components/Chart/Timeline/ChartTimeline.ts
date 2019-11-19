/**
 * ChartTimeline component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

export default function ChartTimeline(vido, props) {
  const { api, state, onDestroy, actions, update, html, createComponent, StyleMap } = vido;
  const componentName = 'chart-timeline';
  const componentActions = api.getActions(componentName);
  const actionProps = { ...props, api, state };

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimeline', value => (wrapper = value)));

  const GridComponent = state.get('config.components.ChartTimelineGrid');
  const ItemsComponent = state.get('config.components.ChartTimelineItems');

  const Grid = createComponent(GridComponent);
  onDestroy(Grid.destroy);
  const Items = createComponent(ItemsComponent);
  onDestroy(Items.destroy);

  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      classNameInner = api.getClass(componentName + '-inner');
      update();
    })
  );

  let styleMap = new StyleMap({}),
    innerStyleMap = new StyleMap({});
  function calculateStyle() {
    const compensation = state.get('config.scroll.compensation');
    const width = state.get('_internal.chart.dimensions.width');
    const height = state.get('_internal.list.rowsHeight');
    styleMap.style.height = state.get('_internal.height') + 'px';
    if (width) styleMap.style.width = width + 'px';
    innerStyleMap.style.height = height + 'px';
    if (width) innerStyleMap.style.width = width + 'px';
    innerStyleMap.style.transform = `translate(0px, ${compensation}px)`;
    update();
  }
  onDestroy(
    state.subscribeAll(
      [
        '_internal.height',
        '_internal.chart.dimensions.width',
        '_internal.list.rowsHeight',
        'config.scroll.compensation'
      ],
      calculateStyle
    )
  );

  componentActions.push(element => {
    state.update('_internal.elements.chart-timeline', element);
  });

  return templateProps =>
    wrapper(
      html`
        <div
          class=${className}
          style=${styleMap}
          data-actions=${actions(componentActions, actionProps)}
          @wheel=${api.onScroll}
        >
          <div class=${classNameInner} style=${innerStyleMap}>
            ${Grid.html()}${Items.html()}
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
