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
  const { api, state, onDestroy, actions, update, html, createComponent } = vido;
  const componentName = 'chart-timeline';
  const componentActions = api.getActions(componentName);

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

  let style = '',
    styleInner = '';
  onDestroy(
    state.subscribeAll(['_internal.height', '_internal.list.rowsHeight', 'config.scroll.compensation'], () => {
      style = `height: ${state.get('_internal.height')}px`;
      const compensation = state.get('config.scroll.compensation');
      styleInner = `height: ${state.get('_internal.list.rowsHeight')}px; margin-top:${compensation}px;`;
      update();
    })
  );

  componentActions.push(element => {
    state.update('_internal.elements.gantt', element);
  });

  return templateProps =>
    wrapper(
      html`
        <div class=${className} style=${style} data-actions=${actions(componentActions)} @wheel=${api.onScroll}>
          <div class=${classNameInner} style=${styleInner}>
            ${Grid.html()}${Items.html()}
          </div>
        </div>
      `,
      { props, vido, templateProps }
    );
}
