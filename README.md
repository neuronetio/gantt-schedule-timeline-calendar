# gantt-schedule-timeline-calendar

### Gantt, schedule, timeline and calendar components all in one!

<div style="display:block;text-align:center">
<img src="https://api.codacy.com/project/badge/Grade/732e0ef156344594b48584af97ba1e4a">
<img src="https://snyk.io/test/github/neuronetio/gantt-schedule-timeline-calendar/badge.svg">
<img src="https://img.badgesize.io/neuronetio/gantt-schedule-timeline-calendar/master/dist/index.umd.js.png?compression=gzip&label=gzipped">
<img src="https://img.shields.io/npm/dm/gantt-schedule-timeline-calendar.svg">
<img src="https://img.shields.io/npm/l/gantt-schedule-timeline-calendar.svg">
<img src="https://badge.fury.io/js/gantt-schedule-timeline-calendar.svg">
<a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fneuronetio%2Fgantt-schedule-timeline-calendar"><img alt="Twitter" src="https://img.shields.io/twitter/url/https/github.com/neuronetio/gantt-schedule-timeline-calendar?style=social"></a>
</div>

gantt-schedule-timeline-calendar is all-in-one component that you can use in different scenarios.

You can use it as schedule for reservation system. You can use it for organizing events. You can use it as gantt chart. Or you can use it as calendar for different purposes.

gantt-schedule-timeline-calendar is very extensible and elastic. You can make your own plugins or modify configuration in couple of ways to achieve your goals.
You can control almost everything. You can change html structure, stylize every html element and even override original components without any compilation stage!

### PS Give it a star :star: if you want more activity in this repo, thanks!

## install

`npm i gantt-schedule-timeline-calendar`

## usage example

[example](https://neuronet.io/gantt-schedule-timeline-calendar/scheduler.html)

```javascript
// GENERATE OR FETCH SOME DATA

const iterations = 1000;

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = i.toString();
  let startDayjs = GSTC.api
    .date()
    .startOf('day')
    .add(i - iterations / 2, 'days');
  rows[id] = {
    id,
    label: 'row id ' + i,
    progress: 50,
    time: {
      start: startDayjs.valueOf(),
      end: startDayjs
        .clone()
        .add(4, 'days')
        .valueOf()
    },
    parentId: withParent ? (i - 1).toString() : undefined,
    expanded: false
  };
}

const items = {};
for (let i = 0; i < iterations; i++) {
  const id = i.toString();
  let startDayjs = GSTC.api
    .date()
    .startOf('day')
    .add(i - iterations / 2, 'days');
  items[id] = {
    id,
    label: 'item id ' + i,
    time: {
      start: startDayjs.valueOf(),
      end: startDayjs
        .clone()
        .add(4, 'days')
        .valueOf()
    },
    progress: 50,
    rowId: id
  };
}

// CONFIGURE COLUMNS VISIBLE ON THE LEFT

const columns = {
  percent: 100,
  resizer: {
    inRealTime: true
  },
  data: {
    id: {
      id: 'id',
      data: 'id',
      width: 50,
      header: {
        content: 'ID'
      }
    },
    label: {
      id: 'label',
      data: 'label',
      expander: true,
      isHtml: true,
      width: 230,
      header: {
        content: 'Label'
      }
    },
    start: {
      id: 'start',
      data(row) {
        return GSTC.api.date(row.time.start).format('YYYY-MM-DD');
      },
      width: 100,
      header: {
        content: 'Start'
      }
    },
    due: {
      id: 'due',
      data(row) {
        return GSTC.api.date(row.time.end).format('YYYY-MM-DD');
      },
      width: 100,
      header: {
        content: 'Due'
      }
    },
    progress: {
      id: 'progress',
      data: 'progress',
      width: 30,
      header: {
        content: '%'
      }
    }
  }
};

// MAKE CONFIGURATION OUT OF IT

const config = {
  height: 40 * 12 + 94,
  list: {
    rows,
    columns,
    expander: {
      padding: 31
    }
  },
  chart: {
    items,
    time: {
      period: 'day'
    }
  },
  classNames: {},
  actions: {},
  locale: {
    name: 'pl',
    weekdays: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
    weekdaysShort: 'Ndz_Pon_Wt_Śr_Czw_Pt_Sob'.split('_'),
    weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
    months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split(
      '_'
    ),
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    weekStart: 1
  }
};

// CREATE COMPONENT STATE FROM CONFIGURATION

let GSTCState = GSTC.api.stateFromConfig(config);

// MOUNT IT !

const app = GSTC({
  element: document.getElementById('app'),
  state: GSTCState
});
```
