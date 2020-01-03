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

<br />
<h3 align="center">If you like it - leave a <a href="https://github.com/neuronetio/gantt-schedule-timeline-calendar">star :star:</a> - it may help improve this lib</h3>
<br />

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

**gantt-schedule-timeline-calendar** configuration could be hard to undestand, so we will explain it gradually (you can also take a look at [types](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/types.d.ts) or [default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts) to understand it better).

Your configuration will be merged recursively with default configuration options ([default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts)) so almost all options are optional.

- `height` `{number}` - component height in pixels
- `headerHeight` `{number}` - height of header and calendar in pixels
- `list` `{object}` - [list configuration](#list-configuration)
- `chart` `{object}` - [chart configuration](#chart-configuration)
- `locale` `{object}` - [locale configuration](#locale-configuration)
- `utcMode` `{boolean}` - dayjs UTC mode on / off
- `components` `{object}` - object that holds [components](#components) used inside `GSTC` - you can replace any component you want
- `wrappers` `{object}` - [wrappers](#wrappers) are functions that can wrap any component html - you can wrap component html in `div`'s or add some html before or after
- `actions` `{object}` - [actions](#actions) can operate directly on `HTMLElements` and can be used to add some event listener or inject/modify some html of the component
- `plugins` `{array}` - array of [plugins](#plugins) that needs to be initialized before `GSTC`
- `plugin` `{object}` - this is a container for plugins to store some data

### list configuration

- `rows` `{object}` - [rows configuration](#rows-configuration)
- `columns` `{object}` - [columns configuration](#columns-configuration)
- `expander` `{object}` - [expander configuration](#expander-configuration)
- `toggle` `{object}` - [toggle configuration](#toggle-configuration)
- `rowHeight` `{number}` - default row height in pixels - this option can be set individually for each row

### rows configuration

Rows are listed on the left side of component (list) and are kind of containers for items (right side - chart).
Rows can contain multiple items.

Rows configuration is an object where key is a row id (`{string}`) and value is an object with data you need for columns configuration or for your use case.

Row should have an id inside as `id` property `{string}`.

Rows can contain also those values:

- `parentId` `{string}` - this is a parent row id for hierarchical data structures
- `expanded` `{boolean}` - if this row have children should it be expanded or collapsed?

```javascript
// example rows configuration (minimal)
const config = {
  list: {
    rows: {
      '1': {
        id: '1'
      },
      '2': {
        id: '2',
        parentId: '1'
      },
      '3': {
        id: '3',
        parentId: '2',
        expanded: true
      },
      '4': {
        id: '4',
        parentId: '3'
      }
    }
  }
};
```

### columns configuration

- `data` `{object}` - [columns data configuration](#columns-data-configuration)
- `resizer` `{object}` - [resizer configuration](#resizer-configuration)
- `percent` `{number}` - percentage width of all columns (0 - 100) if 0 list will disappear (from DOM)
- `minWidth` `{number}` - default minimal width of the column in pixels

### columns data configuration

Columns data configuration is an object where key is an id of the column (`{string}`) and value is [column configuration](#column-configuration).

[Column configuration](#column-configuration) must contain `id` property too.

### column configuration

- `id` `{string}` - id of the column
- `data` `{string | function}` - for string it is a property name that should exists inside row configuration and will display coresponding value, if data is a function it will be executed with row as argument - that function should return a string or lit-html template
- `isHTML` `{boolean}` - if set to true `data` option will be rendered as HTML so be careful and do not let user to inject anything unsafe!
- `width` `{number}` - width of the column in pixels
- `header` `{object}` - [column header configuration](#column-header-configuration)
- `expander` `{boolean}` - should this column contain expander?

```javascript
// example rows and columns configuration (minimal)
const config = {
  list: {
    rows: {
      '1': {
        id: '1',
        label: 'Row 1'
      },
      '2': {
        id: '2',
        parentId: '1',
        label: 'Row 2'
      },
      '3': {
        id: '3',
        parentId: '2',
        expanded: true,
        label: 'Row 3'
      },
      '4': {
        id: '4',
        parentId: '3',
        label: 'Row 4'
      }
    },
    columns: {
      data: {
        'label-column-or-whatever': {
          id: 'label-column-or-whatever',
          data: 'label',
          width: 300,
          expander: true,
          header: {
            content: 'Label'
          }
        },
        'some-html': {
          id: 'some-html',
          isHTML: true,
          data: '<div>your html here</div>',
          width: 400,
          header: {
            content: 'anything'
          }
        }
      }
    }
  }
};
```

### column header configuration

- `content` `{string}` - Label for this header
- `html` `{lit-html template}` - lit-html template if you want html

### expander configuration

- `padding` `{number}` - left padding size in pixels
- `size` `{number}` - size in pixels (width and height)
- `icon` `{object}` - with `width` and `height` properties in pixels `{numbers}`
- `icons` `{object}` - [expander icons configuration](#expander-icons-configuration)

### expander icons configuration

- `child` `{string}` - svg code for non expandable child element
- `open` `{string}` - svg code for open
- `closed` `{string}` - svg code for closed

### toggle configuration

- `display` `{boolean}` - you can show or hide list toggle
- `icons` `{object}` - [toggle icons configuration](#toggle-icons-configuration)

### toggle icons configuration

- `open` `{string}` - svg code for open
- `closed` `{string}` - svg code for closed

### resizer configuration

- `width` `{number}` - resizer width in pixels
- `dots` `{number}` - number of dots

### chart configuration

- `time` `{object}` - [time configuration](#time-configuration)
- `items` `{object}` - [items configuration](#items-configuration)
- `grid` `{object}` - [grid configuration](#grid-configuration)
- `spacing` `{number}` - space between item in pixels

### time configuration

- `from` `{number}` - can be set to limit left side of the chart to specified time in milliseconds
- `to` `{number}` - can be set to limit right side of the chart to specified time in milliseconds
- `zoom` `{number}` - horizontal zoom - lower values for zoom in - values between 10 and 22

### items configuration

Items like rows and columns are an object where key is an item id (`{string}`) and value is [item configuration](#item-configuration)

### item configuration

- `id` `{string}` - item id
- `rowId` `{string}` - in which row this item should appear
- `label` `{string}` - item label
- `time` `{object}` - [item time configuration](#item-time-configuration)

### item time configuration

- `start` `{number}` - start time in milliseconds
- `end` `{number}` - end time in milliseconds

```javascript
// example rows and items configuration (minimal)
const config = {
  list: {
    rows: {
      '1': {
        id: '1',
        label: 'Row 1'
      },
      '2': {
        id: '2',
        parentId: '1',
        label: 'Row 2'
      }
    },
    chart: {
      items: {
        '1': {
          id: '1',
          rowId: '1',
          label: 'Item 1',
          time: {
            start: new Date('2020-01-01').getTime(),
            end: new Date('2020-01-02').getTime()
          }
        },
        '2': {
          id: '2',
          rowId: '2',
          label: 'Item 2',
          time: {
            start: new Date('2020-01-01').getTime(),
            end: new Date('2020-01-02').getTime()
          }
        },
        '3': {
          id: '3',
          rowId: '2',
          label: 'Item 3',
          time: {
            start: new Date('2020-01-03').getTime(),
            end: new Date('2020-01-04').getTime()
          }
        }
      }
    }
  }
};
```

to be continued...

## LICENSE

**[GPL-3.0](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)** if you are using it - your project **must** be GPL-3.0 compatible.

For commercial license please contact me at neuronet.io@gmail.com
