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
  const { api, state, onDestroy, Actions, update, html, createComponent, StyleMap } = vido;
  const componentName = 'chart-timeline';
  const componentActions = api.getActions(componentName);

  const actionProps = { ...props, api, state };

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimeline', value => (wrapper = value)));

  const GridComponent = state.get('config.components.ChartTimelineGrid');
  const ItemsComponent = state.get('config.components.ChartTimelineItems');
  const ListToggleComponent = state.get('config.components.ListToggle');

  const Grid = createComponent(GridComponent);
  onDestroy(Grid.destroy);
  const Items = createComponent(ItemsComponent);
  onDestroy(Items.destroy);
  const ListToggle = createComponent(ListToggleComponent);
  onDestroy(ListToggle.destroy);

  let className, classNameInner;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      classNameInner = api.getClass(componentName + '-inner');
      update();
    })
  );

  let showToggle;
  onDestroy(state.subscribe('config.list.toggle.display', val => (showToggle = val)));

  let styleMap = new StyleMap({}),
    innerStyleMap = new StyleMap({});
  function calculateStyle() {
    const xCompensation = api.getCompensationX();
    const yCompensation = api.getCompensationY();
    const width = state.get('_internal.chart.dimensions.width');
    const height = state.get('_internal.list.rowsHeight');
    styleMap.style.height = state.get('_internal.height') + 'px';
    styleMap.style['--negative-compensation-x'] = xCompensation + 'px';
    styleMap.style['--compensation-x'] = Math.round(Math.abs(xCompensation)) + 'px';
    styleMap.style['--negative-compensation-y'] = yCompensation + 'px';
    styleMap.style['--compensation-y'] = Math.abs(yCompensation) + 'px';
    if (width) {
      styleMap.style.width = width + 'px';
    } else {
      styleMap.style.width = '0px';
    }
    innerStyleMap.style.height = height + 'px';
    if (width) {
      innerStyleMap.style.width = width + xCompensation + 'px';
    } else {
      innerStyleMap.style.width = '0px';
    }
    innerStyleMap.style.transform = `translate(-${xCompensation}px, ${yCompensation}px)`;
    update();
  }
  onDestroy(
    state.subscribeAll(
      [
        '_internal.height',
        '_internal.chart.dimensions.width',
        '_internal.list.rowsHeight',
        'config.scroll.compensation',
        '_internal.chart.time.dates.day'
      ],
      calculateStyle
    )
  );

  componentActions.push(element => {
    state.update('_internal.elements.chart-timeline', element);
  });

  const actions = Actions.create(componentActions, actionProps);
  return templateProps =>
    wrapper(
      html`
        <div class=${className} style=${styleMap} data-actions=${actions} @wheel=${api.onScroll}>
          <div class=${classNameInner} style=${innerStyleMap}>
            ${Grid.html()}${Items.html()}${showToggle ? ListToggle.html() : ''}
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
