/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0
 */

import Vido from '@neuronet.io/vido/vido.esm';
//import Vido from '../../vido/vido.esm';
import publicApi, { getInternalApi } from './api/Api';
import Main from './components/Main';

function GSTC(options) {
  const state = options.state;
  const api = getInternalApi(state);
  const _internal = {
    components: {
      Main
    },
    scrollBarHeight: api.getScrollBarHeight(2),
    height: 0,
    treeMap: {},
    flatTreeMap: [],
    flatTreeMapById: {},
    list: {
      expandedHeight: 0,
      visibleRows: [],
      rows: {},
      width: 0
    },
    dimensions: {
      width: 0,
      height: 0
    },
    chart: {
      dimensions: {
        width: 0,
        innerWidth: 0
      },
      visibleItems: [],
      time: {
        levels: [],
        timePerPixel: 0,
        firstTaskTime: 0,
        lastTaskTime: 0,
        totalViewDurationMs: 0,
        totalViewDurationPx: 0,
        leftGlobal: 0,
        rightGlobal: 0,
        leftPx: 0,
        rightPx: 0,
        leftInner: 0,
        rightInner: 0,
        maxWidth: {}
      }
    },
    elements: {},
    cache: {
      calendar: {}
    }
  };
  if (typeof options.debug === 'boolean' && options.debug) {
    // @ts-ignore
    window.state = state;
  }

  state.update('', oldValue => {
    return {
      config: oldValue.config,
      _internal
    };
  });
  // @ts-ignore
  const vido = Vido(state, api);
  api.setVido(vido);
  const app = vido.createApp({ component: Main, props: {}, element: options.element });
  return { state, app };
}

GSTC.api = publicApi;
export default GSTC;
