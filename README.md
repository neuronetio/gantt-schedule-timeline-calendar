<p align="center">
  <img src="https://neuronet.io/screenshots/gstc9-flat-bgw-300.png" alt="logo">
</p>
<hr />
<h1>gantt-schedule-timeline-calendar</h1>

<h2> Gantt, schedule, timeline and calendar components all in one!</h2>

<p align="center">
  <img src="https://api.codacy.com/project/badge/Grade/732e0ef156344594b48584af97ba1e4a">
  <img src="https://snyk.io/test/github/neuronetio/gantt-schedule-timeline-calendar/badge.svg">
  <img src="https://img.badgesize.io/neuronetio/gantt-schedule-timeline-calendar/master/dist/index.umd.js.png?compression=gzip&label=gzipped">
  <img src="https://img.shields.io/npm/dm/gantt-schedule-timeline-calendar.svg">
  <img src="https://img.shields.io/npm/l/gantt-schedule-timeline-calendar.svg">
  <img src="https://badge.fury.io/js/gantt-schedule-timeline-calendar.svg">
  <a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fneuronetio%2Fgantt-schedule-timeline-calendar"><img alt="Twitter" src="https://img.shields.io/twitter/url/https/github.com/neuronetio/gantt-schedule-timeline-calendar?style=social"></a>
</p>

<h3>gantt-schedule-timeline-calendar is all-in-one component that you can use in different scenarios.</h3>

<p>
You can use it in <strong>react</strong>, <strong>vue</strong>, <strong>angular</strong>, <strong>svelte</strong> or any other projects.
</p>

<p>
You can use it as <strong>schedule</strong> for reservation system. You can use it for organizing <strong>events</strong>. You can use it as <strong>gantt chart</strong>. Or you can use it as <strong>calendar</strong> for different purposes.
</p>

<p align="center">
  <img src="https://neuronet.io/screenshots/appscrn.png?uniq=1" alt="gstc-logo">
</p>

<p>
<strong>gantt-schedule-timeline-calendar</strong> is very extensible and elastic. You can make your own plugins or modify configuration in couple of ways to achieve your goals.
You can control almost everything. You can change html structure, stylize every html element and even override original components without any compilation stage!
</p>

<br /><br />

<h3>Leave a <a href="https://github.com/neuronetio/gantt-schedule-timeline-calendar">star :star:</a> if you want more activity in this repo, or if you need documentation</h3>
<br /><br />
<p align="center">
  <img src="https://neuronet.io/screenshots/scheduler.gif" alt="screencast-1">
  <br />
  <img src="https://neuronet.io/screenshots/gantt.gif" alt="screencast-2">
  <br />
  <img src="https://neuronet.io/screenshots/gstc-1.jpeg" alt="screenshot-1">
</p>

## install

`npm i gantt-schedule-timeline-calendar`

## usage example

[example](https://neuronet.io/gantt-schedule-timeline-calendar/scheduler.html) or [another example](https://neuronet.io/gantt-schedule-timeline-calendar/main.html)

[examples folder](https://github.com/neuronetio/gantt-schedule-timeline-calendar/tree/master/dist/examples)

## configuration

gantt-schedule-timeline-calendar configuration could be hard to undestand, so we will explain it gradually (you can also take a look at [types](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/types.d.ts) or [default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts) to understand it better).

Your configuration will be merged recursively with default configuration options ([default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts) ) so all options are optional.

Configuration options are available at `config.` path of the state (`state.get('config.height')` for example)

### root options

- `height` `{number}` - component height in pixels
- `headerHeight` `{number}` - height of header and calendar in pixels
- `list` `{object}` - list configuration
- `chart` `{object}` - chart configuration
- `locale` `{object}` - locale configuration
- `utcMode` `{boolean}` - dayjs UTC mode on / off
- `components` `{object}` - object that holds components used inside `GSTC` - you can replace any component you want
- `wrappers` `{object}` - wrappers are functions that can wrap any component html - you can wrap component html in `div's` or add some html before or after
- `actions` `{object}` - actions can operate directly on `HTMLElements` and can be used to add some event listener or inject/modify some html of the component
- `plugins` `{array}` - array of plugins that needs to be initialized before `GSTC`
- `plugin` `{object}` - this is a container for plugins to store some data

### list configuration

- `rows` `{object}` - rows are containters for items and may contain some additional data
- `rowHeight` `{number}` - default row height in pixels - could be set individually for each row
- `columns` `{object}` - list columns configuration
- `expander` `{object}` - expander configuration
- `toggle` `{object}` - toggle configuration

### rows configuration

Rows configuration is an object where key is a row id `{string}` and value is an object with data you need for columns configuration or for your use case.

Row should have an id inside value as `id` property `{string}`.

Rows can contain also those values:

- `parentId` `{string}` - this is a parent row id for hierarchical data structures
- `expanded` `{boolean}` - if this row have children should it be expanded or collapsed?

## LICENSE

**GPL-3.0** (for commercial license please contact me at neuronet.io@gmail.com)
