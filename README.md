<p align="center">
  <img src="https://neuronet.io/screenshots/gstc9-flat-bgw-300.png" alt="logo">
</p>
<hr />
<h1 align="center">gantt-schedule-timeline-calendar</h1>

<h2 align="center">Gantt, schedule, timeline and calendar components all in one!</h2>

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

<p align="center">
  <img src="https://neuronet.io/screenshots/appscrn.png?uniq=1" alt="gstc-logo">
</p>

### features

- elastic - you can change almost everything from DOM tree to logic (without any compilation, without modyfing original code - with config, state or plugin)
- super fast! even with large dataset
- multiple items in one row - suitable for different usecases like booking, reservation, resource manager etc.
- tree like structures - collapsible / expandable groups
- moveable / resizeable items
- item movement strategies - x, xy, specified row, basically anything you want
- snap to specified time when resizing / moving
- selectable items, rows, grid cells
- you can define your selection strategy and select only what you want
- gradual time zoom up to 5 minutes
- resizeable list columns
- BEM based CSS rules
- you can easily stylize things when data has been changed (items, rows, grid)
- you can easily add third party libraries
- higly configurable
- plugins support - no need to modify original code
- attractive visually
- written in typescript

<p>
You can use it in <strong>react</strong>, <strong>vue</strong>, <strong>angular</strong>, <strong>svelte</strong> or any other projects.
</p>

<p>
You can use it as <strong>schedule</strong> for reservation system. You can use it for organizing <strong>events</strong>. You can use it as <strong>gantt chart</strong>. Or you can use it as <strong>calendar</strong> for different purposes.
</p>

<p>
<strong>gantt-schedule-timeline-calendar</strong> is very extensible and elastic. You can make your own plugins or modify configuration in couple of ways to achieve your goals.
You can control almost everything. You can change html structure, stylize every html element and even override original components without any compilation stage!
</p>

## examples

[example](https://neuronet.io/gantt-schedule-timeline-calendar/scheduler.html) or [another example](https://neuronet.io/gantt-schedule-timeline-calendar/main.html)

[examples folder](https://github.com/neuronetio/gantt-schedule-timeline-calendar/tree/master/dist/examples)

## react, angular and vue versions

- [react-gantt-schedule-timeline-calendar](https://github.com/neuronetio/react-gantt-schedule-timeline-calendar)
- [angular-gantt-schedule-timeline-calendar](https://github.com/neuronetio/angular-gantt-schedule-timeline-calendar)
- [vue-gantt-schedule-timeline-calendar](https://github.com/neuronetio/vue-gantt-schedule-timeline-calendar)

## screenshots

<p align="center">
  <img src="https://neuronet.io/screenshots/scheduler.gif" alt="screencast-1">
  <br />
  <img src="https://neuronet.io/screenshots/gantt.gif" alt="screencast-2">
</p>
<hr />

<br />
<h3 align="center">Remember to leave a <a href="https://github.com/neuronetio/gantt-schedule-timeline-calendar">star :star:</a></h3>
<br />

## install

`npm i gantt-schedule-timeline-calendar`

or

`<script src="https://cdn.jsdelivr.net/npm/gantt-schedule-timeline-calendar"></script>`

## usage

Basically you need to create some [configuration](#configuration) described below, create state for it and mount component to DOM.

```javascript
const config = {
  /* ... */
};

const state = GSTC.api.stateFromConfig(config);

const app = GSTC({
  element: document.getElementById('your-element-id'),
  state
});
```

## state

**gantt-schedule-timeline-calendar** is using [deep-state-observer](https://github.com/neuronetio/deep-state-observer) so you can checkout its documentation.

## configuration

Your configuration will be merged recursively with default configuration options ([default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts)) so almost all options are optional.

**TIP**: most of the time when you need to modify html or add some events you will need to use [actions](#actions)

**TIP**: take a look at [types](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/types.d.ts) or [default-config](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/src/default-config.ts)

- `height` `{number}` - component height in pixels
- `headerHeight` `{number}` - height of header and calendar in pixels
- `list` `{object}` - [list configuration](#list)
- `chart` `{object}` - [chart configuration](#chart)
- `locale` `{object}` - [locale configuration](#locale)
- `utcMode` `{boolean}` - dayjs UTC mode on / off
- `actions` `{object}` - [actions](#actions) can operate directly on `HTMLElements` and can be used to add some event listener or inject/modify some html of the component
- `wrappers` `{object}` - [wrappers](#wrappers) are functions that can wrap any component html - you can wrap component html in `div`'s or add some html before or after
- `components` `{object}` - object that holds [components](#components) used inside `GSTC` - you can replace any component you want
- `plugins` `{array}` - array of [plugins](#plugins) that needs to be initialized before `GSTC`
- `plugin` `{object}` - this is a container for plugins to store some data

### list

- `rows` `{object}` - [rows configuration](#rows)
- `columns` `{object}` - [columns configuration](#columns)
- `expander` `{object}` - [expander configuration](#expander)
- `toggle` `{object}` - [toggle configuration](#toggle)
- `rowHeight` `{number}` - default row height in pixels - this option can be set individually for each row

### rows

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

### columns

- `data` `{object}` - [columns data configuration](#columns-data)
- `resizer` `{object}` - [resizer configuration](#resizer)
- `percent` `{number}` - percentage width of all columns (0 - 100) if 0 list will disappear (from DOM)
- `minWidth` `{number}` - default minimal width of the column in pixels

### columns data

Columns data configuration is an object where key is an id of the column (`{string}`) and value is [column configuration](#column).

[Column configuration](#column) must contain `id` property too.

### column

- `id` `{string}` - id of the column
- `data` `{string | function}` - for string it is a property name that should exists inside row configuration and will display coresponding value, if data is a function it will be executed with row as argument - that function should return a string or lit-html template
- `isHTML` `{boolean}` - if set to true `data` option will be rendered as HTML so be careful and do not let user to inject anything unsafe!
- `width` `{number}` - width of the column in pixels
- `header` `{object}` - [column header configuration](#column-header)
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

### column header

- `content` `{string}` - Label for this header
- `html` `{lit-html template}` - lit-html template if you want html

### expander

- `padding` `{number}` - left padding size in pixels
- `size` `{number}` - size in pixels (width and height)
- `icon` `{object}` - with `width` and `height` properties in pixels `{numbers}`
- `icons` `{object}` - [expander icons configuration](#expander-icons)

### expander icons

- `child` `{string}` - svg code for non expandable child element
- `open` `{string}` - svg code for open
- `closed` `{string}` - svg code for closed

### toggle

- `display` `{boolean}` - you can show or hide list toggle
- `icons` `{object}` - [toggle icons configuration](#toggle-icons)

### toggle icons

- `open` `{string}` - svg code for open
- `closed` `{string}` - svg code for closed

### resizer

- `width` `{number}` - resizer width in pixels
- `dots` `{number}` - number of dots

### chart

- `time` `{object}` - [time configuration](#time)
- `items` `{object}` - [items configuration](#items)
- `grid` `{object}` - [grid configuration](#grid)
- `spacing` `{number}` - space between item in pixels

### time

- `from` `{number}` - can be set to limit left side of the chart to specified time in milliseconds
- `to` `{number}` - can be set to limit right side of the chart to specified time in milliseconds
- `zoom` `{number}` - horizontal zoom - lower values for zoom in - values between 10 and 22

### items

Items like rows and columns are objects where key is an item id (`{string}`) and value is [item configuration](#item)

### item

- `id` `{string}` - item id
- `rowId` `{string}` - in which row this item should appear
- `label` `{string}` - item label
- `time` `{object}` - [item time configuration](#item-time)

### item time

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
};
```

### locale

Basically locale configuration comes from [dayjs locale object](https://github.com/iamkun/dayjs/blob/dev/docs/en/I18n.md)

- `name` `{string}` - locale name (`en` for example)
- `weekdays` `{string[]}` - array of strings with weekdays starting from sunday (`Sunday`, `Monday` etc)
- `weekdaysShort` `{string[]}` - same as weekdays but little bit shorter (`Sun`, `Mon` ...)
- `weekdaysMin` `{string[]}` - shortest weekdays (`Su`, `Mo` ...)
- `months` `{string[]}` - month names as array of strings
- `monthsShort` `{string[]}` - shorter month names
- `weekStart` `{number}` - week start number from 0 to 6 where 0 = sunday, 1 = monday

### actions

Actions are functions (or classes) that can operate directly on DOM Tree.

With actions you can add additional event listeners, add/update/inject some HTMLElements or add behavior from third party libraries like popups or dialogs.

Action structure is an object where key is component name (kebab-cased) and value is an array of actions that should be fired.
One action is executed on all elements/component instances of specified type.

Available action names:

- `main`
- `list`
- `list-column`
- `list-column-header`
- `list-column-header-resizer`
- `list-column-header-resizer-dots`
- `list-column-row`
- `list-column-row-expander`
- `list-column-row-expander-toggle`
- `list-toggle`
- `chart`
- `chart-calendar`
- `chart-calendar-date`
- `chart-timeline`
- `chart-timeline-grid`
- `chart-timeline-grid-row`
- `chart-timeline-grid-row-block`
- `chart-timeline-items`
- `chart-timeline-items-row`
- `chart-timeline-items-row-item`

Action is a function that is fired when specified DOM Node is created and should return an object with `update` and `destroy` functions.

Each of the functions takes two arguments:

1. Element `{HTMLElement}`
2. Data `{object}`

`update` lifecycle method is fired when element stays where it was, but is reused to display another portion of data (performance optimization).

`destroy` is fired when element is removed from the DOM tree and component is destroyed.

Example action that will add `title` property to each item inside chart.

```javascript
function addItemTitle(element, data) {
  // fired when element / component is created for the first time
  // you can console.log(data) to find out what is inside specified component data
  element.title = data.item.label;

  return {
    update(element, data) {
      // fired when element takes data from another item - data has been changed

      element.title = data.item.label;
    },

    destroy(element, data) {
      // fired when component is destroyed and element is to be removed from DOM tree
      // you can clean up something here
      element.title = '';
    }
  };
}

const config = {
  actions: {
    'chart-timeline-items-row-item': [addItemTitle]
  }
};
```

Add item click event example:

```javascript
function clickAction(element, data) {
  function onClick(event) {
    // data variable will be updated in update method below so it will be always actual
    alert(`Event ${data.item.id} clicked!`);
  }

  element.addEventListener('click', onClick);

  return {
    update(element, newData) {
      data = newData; // data from parent scope updated
    },

    destroy(element, data) {
      element.removeEventListener('click', onClick);
    }
  };
}

const config = {
  /* ... */
  actions: {
    'chart-timeline-items-row-item': [clickAction]
  }
  /* ... */
};
```

Actions can be classes too - with `constructor`, `update` and `destroy` methods.

```javascript
class ItemClickAction {
  constructor(element, data) {
    this.data = data;
    this.onClick = this.onClick.bind(this);
    element.addEventListener('click', this.onClick);
  }

  update(element, data) {
    this.data = data;
  }

  destroy(element, data) {
    element.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    alert(`Item ${this.data.item.id} clicked!`);
  }
}

const config = {
  /* ... */
  actions: {
    'chart-timeline-items-row-item': [ItemClickAction]
  }
  /* ... */
};
```

Action example - add class if item has property `example` set to `true`.

```js
class AddExampleClass{
  constructor(element, data) {
    this.data = data;
    this.element = element;
    this.updateExamplelass();
  }

  update(element, data) {
    this.data = data;
    this.element = element;
    this.updateExampleClass();
  }

  destroy(element, data) {
    element.classList.remove('example-class');
  }

  updateExampleClass() {
    const hasClass = this.element.classList.contains('example-class');
    if(this.data.example && !hasClass){
      this.element.classList.add('example-class');
    }else if(!this.data.example && hasClass){
      this.element.classList.remove('example-class');
    }
  }
}

const config = {
  /* ... */
  chart:{
    items:{
      '1': {
        id: '1',
        time: {/* ... */},
        label: 'with class',
        example: true,
      },
      '2': {
        id: '2',
        time: {/* ... */},
        label: 'without class',
        example: false,
      }
    }
  }
  /* ... */
  actions: {
    'chart-timeline-items-row-item': [ItemIsResizing]
  }
  /* ... */
};
```

### wrappers

**gantt-schedule-timeline-calendar** is using [lit-html](https://github.com/Polymer/lit-html) from polymer project to easly render templates without compilation stage, so if you want to wrap some GSTC component to add some functionality, you can use `html` from `lit-html` and wrappers and at the end your code will be much cleaner.

Wrappers are functions that takes `TemplateResult` from `html` (from `lit-html`) and returns wrapped (or not) version.

Wrappers configuration options is an object where key is component name and value is just function so you can use decorator pattern (replace that function) on it.

Available component names:

- `Main`
- `List`
- `ListColumn`
- `ListColumnHeader`
- `ListColumnHeaderResizer`
- `ListColumnRow`
- `ListColumnRowExpander`
- `ListColumnRowExpanderToggle`
- `ListToggle`
- `Chart`
- `ChartCalendar`
- `ChartCalendarDate`
- `ChartTimeline`
- `ChartTimelineGrid`
- `ChartTimelineGridRow`
- `ChartTimelineGridRowBlock`
- `ChartTimelineItems`
- `ChartTimelineItemsRow`
- `ChartTimelineItemsRowItem`

Example that shows how to wrap list column row with `div` and additional class.

```javascript
let oldWrapper;

function addClassWrapper(input) {
  let result = oldWrapper(input);
  result = html`
    <div class="additional-class">${result}</div>
  `;
  return result;
}

// after GSTC is loaded and running so we could save oldWrapper
state.update('config.wrappers', wrappers => {
  oldWrapper = wrappers.ListColumnRow;
  wrappers.ListColumnRow = addClassWrapper;
  return wrappers;
});
```

### components

In **gantt-schedule-timeline-calendar** you can replace any component with your implementation.

Just copy interesting component - modify it and set up in `components` configuration property.

Component configuration is (just like above) object where key is a component name and value is just component itself.

Available component names:

- `Main`
- `List`
- `ListColumn`
- `ListColumnHeader`
- `ListColumnHeaderResizer`
- `ListColumnRow`
- `ListColumnRowExpander`
- `ListColumnRowExpanderToggle`
- `ListToggle`
- `Chart`
- `ChartCalendar`
- `ChartCalendarDate`
- `ChartTimeline`
- `ChartTimelineGrid`
- `ChartTimelineGridRow`
- `ChartTimelineGridRowBlock`
- `ChartTimelineItems`
- `ChartTimelineItemsRow`
- `ChartTimelineItemsRowItem`

Components are functions that takes operational functions `vido` and `props` as second argument.
Component must return a render function with `html` ([lit-html](https://github.com/Polymer/lit-html)).

```javascript
function ExampleComponent(vido, props) {
  const { html, update } = vido;

  let name = 'John';
  const onClickHandler = event => {
    name = 'Jack';
    update();
  };

  return () =>
    html`
      <div class="example-component" @click=${onClickHanlder}>Hello ${name}</div>
    `;
}
```

### plugins

By default there are couple of plugins available:

- [CalendarScroll](#calendarscroll-plugin)
- [ItemMovement](#itemmovement-plugin)
- [Selection](#selection-plugin)
- [WeekendHighlight](#weekendhighlight-plugin)

#### CalendarScroll plugin

With this plugin you will be able shift / scroll view horizontally by grabbing and moving dates at the top.

##### options

- `speed` `{number}` `default: 1`
- `hideScroll` `{boolean}` `default: false` - hide gstc bottom scrollbar
- `onChange` `{function}` - on change callback `onChange(time){/*...*/}`

##### usage

`<script src="https://cdn.jsdelivr.net/npm/gantt-schedule-timeline-calendar/dist/CalendarScroll.plugin.js"></script>`

or from your local `node_modules` dir

`<script src="/node_modules/gantt-schedule-timeline-calendar/dist/CalendarScroll.plugin.js"></script>`

or

`import CalendarScroll from "gantt-schedule-timeline-calendar/dist/CalendarScroll.plugin.js"`

```javascript
const config = {
  /*...*/
  plugins: [
    CalendarScroll({
      speed: 1,
      hideScroll: true,
      onChange(time) {
        console.log(time);
      }
    })
  ]
  /*...*/
};
```

#### ItemMovement plugin

With this plugin you will be able to move / resize items.

##### options

- `moveable` `{boolean | string}` - you can turn off moving capabilities and use just resizing feature, items also might be moveable only along with the specified axis `moveable:'x'`, `moveable:'y'`
- `resizeable` `{boolean}` - should items be resizeable?
- `resizerContent` `{string}` - html content of the resizer
- `collisionDetection` `{boolean}` - block overlaping items when resizing / moving
- `snapStart` `{function}` `(timeStart: number, startDiff: number, item: object) => number;` - function that will return new item time in miliseconds while moving - if you want snap to days - checkout example
- `snapEnd` `{function}` `(timeEnd: number, endDiff: number, item: object) => number` same as above but for end of item `api.time.date(timeEnd+endDiff).endOf('day')`
- `ghostNode` `{boolean}` - ghost node should be visible?
- `wait` `{number}` - sometimes you just want to click an item and sometimes you want to move it, this option will tell gstc to wait some time while mouse button is down to turn on moving mode to prevent accidental item move while clicking - time in miliseconds

You can also add `moveable` and `resizeable` option to each item so you will be able to block movement / resizing of some items or limit movement / resizing to specified axis.
When you need to move specified item only in some rows you can set `item.moveable` to array of row ids `item.moveable = ['1','2','5']`.

```javascript
const config = {
/*...*/
  chart: {
    items: {
      '1': {
        id: '1',
        rowId: '1',
        moveable: false, // NOT MOVEABLE
        resizeable: false, // NOT RESIZEABLE
        label: 'Item 1',
        time: {
          start: new Date('2020-01-01').getTime(),
          end: new Date('2020-01-02').getTime()
        }
      },
      '2': {
        id: '2',
        rowId: '2',
        moveable: ['1'], // MOVEABLE ONLY WITHIN ROW '1'
        resizeable: true, // RESIZEABLE
        label: 'Item 2',
        time: {
          start: new Date('2020-01-01').getTime(),
          end: new Date('2020-01-02').getTime()
        }
      },
      '3': {
        id: '3',
        rowId: '2',
        moveable: 'y', // MOVEABLE ONLY WITHIN Y AXIS
        resizeable: true, // RESIZEABLE
        label: 'Item 3',
        time: {
          start: new Date('2020-01-03').getTime(),
          end: new Date('2020-01-04').getTime()
        }
      }
    }
  }
};
```

##### usage

`<script src="https://cdn.jsdelivr.net/npm/gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js"></script>`

or from your local `node_modules` dir

`<script src="/node_modules/gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js"></script>`

or

`import ItemMovement from "gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js"`

```javascript
const config = {
  /*...*/
  plugins: [
    ItemMovement({
      moveable: 'x',
      resizerContent: '<div class="resizer">-></div>',
      ghostNode: false,
      // snap item start time to start of the day
      snapStart(time, diff, item) {
        return api.time
          .date(time)
          .add(diff, 'milliseconds')
          .startOf('day')
          .valueOf();
      },
      // snap item end time to end of the day
      snapEnd(time, diff, item) {
        return api.time
          .date(time)
          .add(diff, 'milliseconds')
          .endOf('day')
          .valueOf();
      }
    })
  ]
  /*...*/
};
```

#### Selection plugin

With this plugin you can select cells or items and then fire some action.

##### options

- `grid` `{boolean}` - can we select grid cells?
- `items` `{boolean}` - can we select items?
- `rows` `{boolean}` - can we select rows?
- `horizontal` `{boolean}` - can we select horizontally? (or just vertically if selected)
- `vertical` `{boolean}` - can we select vertically? (or just horizontally if selected)
- `rectStyle` `{object}` - selecting rectangle style definition as object
- `selecting` `{function}` `(data, type: string) => void;` - event callback while selecting - will inform you what is actually selected while selecting process is running (realtime) so you can modify selected cells
- `deselecting` `{function}` `(data, type: string) => void;` - event callback that will inform you what was unselected while selecting process is running - realtime
- `selected` `{function}` `(data, type) => void;` - event callback fired when selection process is finished (final event) and something is selected (or not)
- `deselected` `{function}` `(data, type) => void;` - event callback fired when something previously selected is unselected now (after selection process is finished - final)
- `canSelect` `{function}` `(type, state, all) => any[];` - can we select this things? should return what should be selected - you can remove what you don't want to select
- `canDeselect` `{function}` `(type, state, all) => any[];` - can we deselect this things? should return what could be unselected - you can filter it out

##### usage

`<script src="https://cdn.jsdelivr.net/npm/gantt-schedule-timeline-calendar/dist/Selection.plugin.js"></script>`

or from your local `node_modules` dir

`<script src="/node_modules/gantt-schedule-timeline-calendar/dist/Selection.plugin.js"></script>`

or

`import Selection from "gantt-schedule-timeline-calendar/dist/Selection.plugin.js"`

```javascript
const config = {
  /*...*/
  plugins: [
    Selection({
      items: false,
      rows: false,
      grid: true, // select only grid cells
      rectStyle: { opacity: '0.0' }, // hide selecting rectangle
      // if there is an item in the current selected cell - do not select that cell
      canSelect(type, currentlySelecting) {
        if (type === 'chart-timeline-grid-row-block') {
          // check if there is any item that lives inside current cell
          return currentlySelecting.filter(selected => {
            if (!selected.row.canSelect) return false;
            for (const item of selected.row._internal.items) {
              if (
                (item.time.start >= selected.time.leftGlobal && item.time.start <= selected.time.rightGlobal) ||
                (item.time.end >= selected.time.leftGlobal && item.time.end <= selected.time.rightGlobal) ||
                (item.time.start <= selected.time.leftGlobal && item.time.end >= selected.time.rightGlobal)
              ) {
                return false;
              }
            }
            return true;
          });
        }
        return currentlySelecting;
      },
      canDeselect(type, currently, all) {
        if (type === 'chart-timeline-grid-row-blocks') {
          // if we are selecting we can clear previous selection by returning [] else if
          // we are not selecting but something is already selected let it be selected - currently
          return all.selecting['chart-timeline-grid-row-blocks'].length ? [] : currently;
        }
        return [];
      },
      selecting(data, type) {
        //console.log(`selecting ${type}`, data);
      },
      deselecting(data, type) {
        //console.log(`deselecting ${type}`, data);
      },
      selected(data, type) {
        //console.log(`selected ${type}`, data);
      },
      deselected(data, type) {
        //console.log(`deselected ${type}`, data);
      }
    })
  ]
  /*...*/
};
```

#### WeekendHighlight plugin

With this plugin gantt-schedule-timeline-calendar will be able to highlight weekends.

##### options

- `weekdays` `{number[]}` - array of weekdays we want to highlight where 0 = Sunday
- `className` `{string}` - class that you want to add to highlighet days - `gantt-schedule-timeline-calendar__chart-timeline-grid-row-block--weekend` by default

##### usage

`<script src="https://cdn.jsdelivr.net/npm/gantt-schedule-timeline-calendar/dist/WeekendHighlight.plugin.js"></script>`

or from your local `node_modules` dir

`<script src="/node_modules/gantt-schedule-timeline-calendar/dist/WeekendHighlight.plugin.js"></script>`

or

`import WeekendHighlight from "gantt-schedule-timeline-calendar/dist/WeekendHighlight.plugin.js"`

```javascript
const config = {
  /*...*/
  plugins: [
    WeekendHighlight({
      weekdays: [6, 0], // Saturnday, Sunday
      className: 'your-class-for-highlighted-days'
    })
  ]
  /*...*/
};
```

#### your own plugins - example

will higlight weekends

```javascript
import { Action } from '@neuronet.io/vido/vido.esm';

export default function WeekendHiglight(options: {}) {
  const weekdays = options.weekdays || [6, 0];
  let className;
  let api;

  class WeekendHighlightAction extends Action {
    constructor(element, data) {
      super();
      this.highlight(element, data.time.leftGlobal);
    }

    update(element, data) {
      this.highlight(element, data.time.leftGlobal);
    }

    highlight(element, time) {
      const isWeekend = weekdays.includes(api.time.date(time).day());
      const hasClass = element.classList.contains(className);
      if (!hasClass && isWeekend) {
        element.classList.add(className);
      } else if (hasClass && !isWeekend) {
        element.classList.remove(className);
      }
    }
  }

  return function initialize(vido) {
    api = vido.api;
    className = options.className || api.getClass('chart-timeline-grid-row-block') + '--weekend';
    vido.state.update('config.actions.chart-timeline-grid-row-block', actions => {
      actions.push(WeekendHighlightAction);
      return actions;
    });
  };
}
```

## LICENSE

**[AGPL-3.0](https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)** if you are using it - your project **must** be AGPL-3.0 compatible.

For commercial license please contact me at neuronet.io@gmail.com
