# CHANGELOG

## [3.34.9] [2023-09-11]

- npm libraries updated

## [3.34.8] [2023-09-11]

- DependencyLines plugin - fixed a bug where the lines were cut off when the row was higher than the chart area

## [3.34.7] [2023-09-11]

- Fixed a bug where after clicking on an item, the chart area moved slightly (part 2)

## [3.34.6] [2023-09-11]

- Fixed a bug where after clicking on an item, the chart area moved slightly (part 1)

## [3.34.5]

- Progress bar shows up even when the item has no time (0ms) (#383)

## [3.34.4]

- Fixed a bug with dynamic locale update - the calendar was not updated when the locale was changed (#368).

## [3.34.3]

- Fixed a bug that occurred when the row was higher than innerHeight of the chart - the rows were not displayed.

## [3.34.2]

- overlapped items order improvement

## [3.34.1]

- fixed bug with items overlapping

## [3.34.0]

- (#381) added new scrolling behavior (pixel based scrolling instead of row based) `config.scroll.vertical.byPixels` and `config.scroll.horizontal.byPixels` (boolean values)

## [3.33.17]

- #380 bugfix (bug where item stayed on a lower level even when it was no longer overlapped by others)

## [3.33.16]

- #373 bugfix - The mechanism for stacking items that overlap has been improved. They now appear in the order they were added when their timing is the same.

## [3.33.15]

- license key check mechanism bug fix

## [3.33.14]

- delete selected item bugfix (#348)
- fixed bug with clip-path attached to foreignObject which caused ItemTypes plugin to not respond to pointer events (like resize)

## [3.33.13]

- multiple components on one page bugfix
- added example for multiple components

## [3.33.12]

- origin check mechanism updated

## [3.33.11]

- added `GSTC.api.mergeDeep` and `GSTC.api.clone` methods

## [3.33.10]

- `fromArray` will now check `linkedWith` also

## [3.33.9]

- Added `rowId` check for items. The component will throw an error when a row is not found or when the id has an invalid type.
- Added checking that all items exist and that, for example, they have not been modified via references from `state.get`.

## [3.33.8]

- origin with wildcard bugfix

## [3.33.7]

- `ItemMovement` `threshold` options ignored bugfix
- added `ItemResizing` `threshold` option
- updated `complex-1` and `one-month` examples

## [3.33.6]

- updated and added dependent libraries to `package.json` due to missing type errors

## [3.33.5]

- complex example updated (missing bookmarks)

## [3.33.4]

- garbage removed

## [3.33.3]

- performance optimization
- throws an error when `item.time.start` or `item.time.end` is not a number
- throws an error when `config.chart.time.from` or `config.chart.time.to` is not a number and is defined

## [3.33.2]

- time bookmarks sometimes disappear without a reason bugfix
- fixed `api.time.getGlobalOffsetPxFromDates`
- performance optimization when all of the items are out of the view (on the left side or on the right side)
- `time.leftGlobal` was calculated based on centerDate, which was no longer available due to a change in dates bugfix

## [3.33.1]

- fixed bug with `location.ancestorOrigins` [on firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1085214)
- added origins property to the state `state.get('origins')`

## [3.33.0]

- array merging bugfix
- merging objects performance optimization
- removed non documented not needed `config.chart.time.allDates` and `config.chart.time.datesCache` (huge time calculation performance optimization)
- grid cell generation little performance optimization

## [3.32.0]

- `deep-state-observer` updated (update whole state bugfix)
- added `$data.initializedPlugins` `Set`
- plugins are now destroyed only when whole gstc instance is destroyed or plugin was removed from config
- `recalculateTime` method added to the time api (`gstc.api.time.recalculateTime()`) to regenerate calendar dates or recalculate `$data.chart.time` values - for example if some logic in `onLevelDates` was changed then you might need this to generate new dates and trigger `onLevelDates` again
- `ItemMovement`, `ItemResizing`, `TimelinePointer` and `Selection` plugins refactored
- `gstc-loaded` event is triggered a little bit later now when all time calculations are complete
- `complex-1` example updated - added history state management demo
- `one-month` example updated - `gstc.api.time.recalculateTime()` added instead of full reload

## [3.31.0]

- when `periodIncrement` is a function and the item is moved to the left side past the visible area we don't know which date to start generating dates from so we just return `time.from` which blocks the movement of the item
- added `allowItemsToGoOutsideTheArea` `boolean` (default:`true`) value to ItemMovement and ItemResizing options

## [3.30.0]

- support for iframe usage: domains with `>` symbol like `one.com>two.com>three.com` (available only with SaaS license)

## [3.29.0]

- examples updated
- changelog reversed (latest versions on top)
- empty item style was not updated #344 bugfix
- not needed dependencies removed
- lit-html updated
- merge function improved
- added `GSTC.Vido` property with `GSTC.Vido.directives` to easily create templates without need to import `lit-html`

## [3.28.0]

- added `outOfView` with `left`, `right` and `whole` boolean properties to `ItemData` to know when the item is outside a view from item props only
- all rows expander was missing bugfix
- row `visible` property added to determine whether the row should be visible on the list (usable for searching and filtering)

## [3.27.3]

- ItemResizing plugin `onEnd` event was fired twice bugfix
- ItemMovement & ItemResizing `onEnd` event was fired without dependant items bugfix

## [3.27.2]

- ItemResizing plugin - dependant option set to false caused call to undefined method #343 bugfix

## [3.27.1]

- npm dependencies updated

## [3.27.0]

- ItemMovement & ItemResizing now snap to time from main dates by default (not startOf the current period because periodIncrement may be different than 1)
- `config.chart.time.alignLevelsToMain` fixed dates positions calculation when main dates start and end values were in the middle of the other levels (weeks and months for example)
- level dates calculations code refactoring
- `GSTC.api.fromArray` fixes gstcid in dependant items now
- [**breaking***] default `config.locale.weekStart` is set to 0 now (Sunday) (not 1=Monday)
- dayjs locale is now used locally inside time api from `gstc.api.time.date` method
- `GSTC.api.date` method now supports locale configuration as third parameter `GSTC.api.date(time, utcMode, localeConfig)`
- `GSTC.api.GSTCID` will now check if given id is already in proper format

## [3.26.2]

- dependency lines plugin stops draw lines when two connected items was detached bugfix

## [3.26.1]

- there was a bug when gstc wanted to save dates to cache but cache was not ready for that

## [3.26.0]

- added `percent` to `$data.scroll.horizontal` and `$data.scroll.vertical`
- when horizontal scroll bar position is at the beginning or at the end position then don't calculate new position basing on center date

## [3.25.2]

- [**breaking***] ItemMovement and ItemResizing do not snap dependant items to time because it led to time slips

## [3.25.1]

- [**breaking***] ItemMovement `snapToTime.end` no longer snaps as default behavior as it can change duration when zoom mode is set to display months (different months have different number of days)

## [3.25.0]

- ItemMovement & ItemResizing dependant items movement algorithm updated

## [3.24.0]

- [**breaking\*** - 3.23.0] `DataChartTimeLevelDate` now contains `DST` with `diffMs:number`, `afterTime:number` and `afterDate:Dayjs` object instead of `diffDST:number` only
- ItemMovement dependant items initial values bugfix
- ItemResizing plugin now takes DST into account while resizing

## [3.23.0]

- `DataChartTimeLevelDate` now includes `diffDST` which is a difference between standard period and period in DST daylight saving time - date may be shorter (negative value) or longer than the standard date
- ItemMovement plugin now takes DST into account while moving

## [3.22.2]

- The row items are now sorted in ascending order by start time

## [3.22.1]

- in some cases, the incorrect vertical position of the item was calculated #340 bugfix

## [3.22.0]

- performance optimization
- new readonly dates cache added to `config.chart.time.datesCache`

## [3.21.2]

- changed `config.plugin.ItemMovement.autoScroll.edgeThreshold.horizontal` and `config.plugin.ItemResizing.autoScroll.edgeThreshold` default value to `0` because sometimes it may trigger unwanted auto scroll #339

## [3.21.1]

- current date highlight blinking bugfix

## [3.21.0]

- added ability to specify item spacing on the left and on the right side `config.chart.spacing.left` and `config.chart.spacing.right` or just right `config.chart.spacing` = number of pixels

## [3.20.1]

- sometimes clicking of an item may trigger autoScroll feature in ItemResizing plugin #339 bugfix

## [3.20.0]

- current dates are checked continuously `config.chart.time.checkCurrentDateInterval` default = 5minutes
- added zoom levels down to 9 (minutes)
- sometimes clicking of an item may trigger autoScroll feature in ItemMovement plugin #339 bugfix

## [3.19.16]

- current date highlight bugfix #338

## [3.19.5]

- calendar date width calculation bugfix when date was bigger than view

## [3.19.4]

- in some circumstances items from hidden rows was visible #317 bugfix

## [3.19.3]

- lines was visible outside view in dependencyLines plugin bugfix

## [3.19.2]

- fixed with wrong width of the item if it was moved outside view with hidden weekends enabled and start of the next month was a weekend

## [3.19.1]

- when the end time of an item is inside a missing date and we move this item by 1px it will change its width bugfix
- in calculatedZoomMode + hide weekends when date was moved out of the scope wrong right date was calculated bugfix

## [3.19.0]

- ItemMovement & ItemResizing move dependant items wrong time offset bugfix
- [**breaking***] ItemMovement & ItemResizing dependant items automatically added to `items.initial`,`items.before` & `items.after`
- added ItemMovement `moveDependantVertically` option to move dependant items vertically along with the selected one
- added `addedDependantIds` and `selectedIds` to event argument in ItemMovement & ItemResizing
- added `item` to snap time events (may be null when calculating pointer movement offset)
- [**breaking***] ItemResizing snap to start time can pass item as `null` now when calculating pointer movement offset

## [3.18.0]

- added a readonly `periodIncrementedBy` value to level dates `DataChartTimeLevelDate` that tells what increment was used to calculate that date
- added option `config.chart.time.alignLevelsToMain` to automatically scale other levels to main dates when some of main dates are missing (weekends for example)
- ItemMovement & ItemResizing better handling of dependant items
- `gstc.api.scrollToTime` centered wrong dates bugfix
- added `config.chart.time.timePerPixel` readonly property

## [3.17.0]

- itemResizing and itemMovement - item time calculation bugfix
- `config.chart.time.additionalChartSpaces` removed (was not documented)
- time calculation now works better with removed dates by the user (onLevelDates event)
- added duration dayjs plugin loaded by default
- spacing is no longer taking into account with item.width - now it is full width without subtracting spacing (1px) for itemData.width and itemData.actualWidth
- default spacing is set to 4 instead of 1 (looks better) `config.chart.spacing`
- added `config.chart.time.autoExpandTimeFromItems` option to expand time when item is out of the current view

## [3.16.6]

- itemResizing plugin - item resizing wrong width calculation bugfix

## [3.16.5]

- itemMovement plugin - item jumps over one cell when dragging bugfix

## [3.16.4]

- itemMovement `ignoreMissingDates` option added
- itemMovement wrong item width bug fixed

## [3.16.3]

- fixed bug 'Cannot read properties of undefined (reading leftPx)' when moving item outside view with autoscrolling enabled

## [3.16.2]

- #325 bugfix (dayjs.locale is not a function)
- ability to use component on external servers on premise with domain keywords like app-name.\*
- fixed bug when moving items outside a view

## [3.16.1]

- scroll bar handle more visible in dark mode
- main import file with wasm file included

## [3.16.0]

- removed junk dev dependencies
- added dark theme support
- fixed calculatedZoomMode initial render

## [3.15.8]

- cypress updated to 9.2.0
- updating locale bugfix (#230)

## [3.15.7]

- fixed column header resizing dots disappearing when width was smaller than text (#322)

## [3.15.6]

- fixed missing api types

## [3.15.5]

- types renamed from `*.d.ts` to `min.d.ts`

## [3.15.4]

- bad scroll position after changing chart width bugfix
- moving item outside of the current time resets scroll position bugfix

## [3.15.3]

- empty chart after updating rows bugfix

## [3.15.2]

- package.json updated

## [3.15.1]

- package.json updated

## [3.15.0]

- license key checking mechanism updated to v3

## [3.14.49]

- `scrollToTime` centered bugfix

## [3.14.48]

- grid cells cache bugfix
- dependency lines bugfix
- fixed issue with `calculatedZoomMode` change (#316)

## [3.14.47]

- fixed travis yml file needed to run tests in CI

## [3.14.46]

- updated `@cypress/request` to `2.88.9`

## [3.14.45]

- added before_script to travis to set timezone properly

## [3.14.44]

- added timezone to travis
- do not upload videos if test is successful (cypress option added)

## [3.14.43]

- utc mode bugfix #321
- utc mode tests added
- added `"@cypress/request": "2.88.7"` to `package.json` because of [this cypress bug](https://github.com/cypress-io/cypress/issues/19097)

## [3.14.42]

- csstype junk removed

## [3.14.41]

- cypress updated
- timeline bookmarks tests added
- added `isInCurrentView` in time api
- fixed #319

## [3.14.40]

- tests updated

## [3.14.39]

- `.eslintignore` removed and added ingore pattern to `.eslintrc.json`
- tests updated

## [3.14.38]

- `.eslintignore` added

## [3.14.37]

- tests updated

## [3.14.36]

- tests updated

## [3.14.35]

- tests updated

## [3.14.34]

- tests updated

## [3.14.33]

- cleaning up chart dimensions properties
- other package.json cypress commands updated (nodejs 17.x `Error: error:0308010C:digital envelope routines::unsupported` bugfix)

## [3.14.32]

- test command updated (nodejs 17.x `Error: error:0308010C:digital envelope routines::unsupported` bugfix)

## [3.14.31]

- updated rows were visible only after scroll bugfix

## [3.14.30]

- change column visibility bugfix

## [3.14.29]

- dates generation bugfix

## [3.14.28]

- removed firefox from default testing because in some env actual firefox is not installed and tests cannot be executed
- added `npm run test:full` to test on firefox also

## [3.14.27]

- resizing handles not visible when using item-types plugin and width is below threshold bugfix (#226)
- item tests improved
- testing in chrome and firefox

## [3.14.26]

- calendar levels bugfix
- tests improvements

## [3.14.25]

- column header render template bugfix

## [3.14.24]

- tests improved

## [3.14.23]

- `data-gstcid` added to some elements
- cypress testing framework added

## [3.14.22]

- horizontal scroll bar positive precise offset bugfix

## [3.14.21]

- horizontal scroll bar last position was not accessible bugfix

## [3.14.20]

- `ItemMovement` and `ItemResizing` DST (Daylight saving time) bugfix

## [3.14.19]

- sorting nested rows bugfix (#303)

## [3.14.18]

- style updated: list position is now `relative`

## [3.14.17]

- fixed missing `cache` list template variable
- added `additionalSpace` useful when we want to add new content above and below chart (see `messing-with-templates` example)

## [3.14.16]

- selection plugin optimization and item is returned in event (not `itemData`)
- state now contains license information `state.get('license')`
- item movement improved

## [3.14.15]

- performance optimization
- row items pointer events bugfix
- detach directive removed (cache directive is a better alternative)

## [3.14.14]

- when scroll position is higher than number of rows visible rows not showing up bugfix
- when `time.from` and `time.to` are not set when changing data nothing shows up bugfix
- huge performance optimizations

## [3.14.13]

- grid cells cache bugfix

## [3.14.12]

- a little bit of optimization again

## [3.14.11]

- Math.round for all css positions
- bookmark height bugfix

## [3.14.10]

- cell content bugfix

## [3.14.9]

- performance optimizations
- scrollbar visibility bugfix when all dates are visible bugfix
- grid cells cache bugfix

## [3.14.8]

- grid cells cache bugfix

## [3.14.7]

- scroll bar pointer events works on touch devices now

## [3.14.6]

- `config.chart.time.calendarLevels -> periodIncrement` `leftDate` argument changed to `date`

## [3.14.5]

- `config.chart.item.overlap` option added

## [3.14.4]

- time diff bugfix

## [3.14.3]

- bookmarks DOM divided into two parts
- chart overflow visible changed back to hidden

## [3.14.2]

- bookmarks style option added and changed DOM position

## [3.14.1]

- timeline pointer plugin precise position bugfix

## [3.14.0]

- huge performance improvement
- fixed rows sorting (#297)
- horizontal scroll precise option implemented

## [3.13.4]

- vertical scrollbar weird behavior at the end of the scroll area fixed

## [3.13.3]

- working with bigger data set is now much faster

## [3.13.2]

- loading big data set is a little bit faster now

## [3.13.1]

- item `minWidth` bugfix (#296)

## [3.13.0]

- `ExportPDF` plugin added

## [3.12.0]

- `ExportImage` plugin added

## [3.11.4]

- vido updated (StyleMap bugfix)

## [3.11.3]

- itemMovement & itemResizing update state bugfix
- calendar dates with wrong widths when week or non standard period is used as main date bugfix (#294)

## [3.11.2]

- bookmarks improved (show only bookmarks that are in current view)

## [3.11.1]

- bookmarks plugin `className` bugfix

## [3.11.0]

- `config.templates` configuration added - now you can use templates for all components

## [3.10.4]

- time bookmarks plugin custom `className` not appearing bugfix

## [3.10.3]

- do not expand view while resizing or moving in `config.chart.time.calculatedZoomMode`

## [3.10.2]

- jest testing engine updated

## [3.10.1]

- move dependant items only when time was changed bugfix

## [3.10.0]

- vido updated

## [3.9.3]

- `DeepState`, `Api`, `publicApi`, `CSSProps`, `ComponentInstance` types added

## [3.9.2]

- `deep-state-observer` updated
- gstcInstance.api.setScrollTop now accepts `number` (for row index inside rows with parents expanded array) and `string` for rowId

## [3.9.1]

- `deep-state-observer` updated

## [3.9.0]

- deep-state-observer updated
- classes on the DOM Element is not displaying `id`s to improve performance a lot

## [3.8.4]

- add item by id bugfix (#286)

## [3.8.3]

- add row by id bugfix
- scroll area watching bugfix

## [3.8.2]

- `autoInnerHeight` bugfix when `innerHeight` is not specified
- horizontal scroll goes to vertical scroll position when window is resized with `autoInnerHeight` option enabled bugfix

## [3.8.1]

- wrong scroll position after changing innerHeight bugfix

## [3.8.0]

- innerHeight bugfix (#242)
- automatic innerHeight feature (#276)

## [3.7.16]

- added `hidden` to the column data to easily hide column without changing data
- added `position` to show columns in specified order

## [3.7.15]

- changing columns bugfix (#278)

## [3.7.14]

- selection plugin not selecting grid cells bugfix

## [3.7.13]

- performance optimization

## [3.7.12]

- `gstc-loaded` event bugfix and it fires only once to listen config changes just subscribe `state.subscribe('config;', ()=>{ console.log('gstc reloaded') })`

## [3.7.11]

- console.log :/

## [3.7.10]

- (code cleanup) some properties from `config.scroll` moved to `$data.scroll`
- (code cleanup) `config.items.*.selected` and `config.items.*.selecting` moved to `$data.items.*.selected` and `$data.items.*.selecting`
- minor performance improvements

## [3.7.9]

- performance optimization

## [3.7.8]

- Selection plugin: changed path from `gstc.api.plugins.selection` to `gstc.api.plugins.Selection`
- Selection plugin: added ITEM and CELL string to api

## [3.7.7]

- gstc.api.render() method added to refresh the view if needed

## [3.7.6]

- ItemResizing plugin handle content improvement (function | object) with left and right values

## [3.7.5]

- right arrow not appearing in some circumstances bugfix

## [3.7.4]

- cut items to last date

## [3.7.3]

- cache calculation bugfix (chart not responding to all changes)

## [3.7.2]

- #275 bugfix (wrong right position of the item in calculatedTimeZoom mode)

## [3.7.1]

- license info stored in state (`state.get('license')`)
- grid cells bugfix

## [3.7.0]

- offline licenses
- minified code undefined variables bugfix

## [3.6.6]

- performance
- plugins destroy bugfix

## [3.6.5]

- npm update
- minor types update

## [3.6.4]

- types improvement

## [3.6.3]

- #217 bugfix

## [3.6.2]

- #216 bugfix

## [3.6.1]

- `This domain is not registered for your license ( undefined ).` bugfix

## [3.6.0]

- Code refactoring
- gstc.api.getCurrentCalendarLevels method added
- #213 sorting bugfix
- load performance optimization (`state.update('config', ...)`, `state.update('config.list.rows',...)` and `state.update('config.chart.items',...)` also)
- #202 fixed

## [3.5.5]

- ProgressBar width bugfix

## [3.5.4]

- ProgressBar width bugfix

## [3.5.3]

- rows height calculation bugfix

## [3.5.2]

- changed slot a little bit so ItemTypes plugin can work with ItemResizer plugin (inside item)

## [3.5.1]

- ItemTypes plugin is now compatible with item slots

## [3.5.0]

- Component templates support (for item only just for now)
- ItemTypes plugin

## [3.4.8]

- remove handles from item when selected property was set to false (ItemResizing plugin bugfix)
- more responsive item property watcher
- invalid item position caused by DependencyLines plugin (bugfix)

## [3.4.7]

- console.log removed...
- invalid row height and disappearing overlapping items bugfix

## [3.4.6]

- dependency lines plugin should not display lines if items are outside of the whole timeline (not current view)
- throw more reasonable error when there is no item or cell with specified id when selecting
- getAllGridCells and getAllGridRows added in gstc instance api
- a full reload was fired when it shouldn't (bugfix)
- deep-state-library updated with couple of bugfixes

## [3.4.5]

- file:/// protocol warning (gstc will not work with local files)
- #204 bugfix

## [3.4.4]

- moved tests to examples dir 😏

## [3.4.3]

- moved tests to tests dir and linked examples

## [3.4.2]

- readme update

## [3.4.1]

- build bugfix

## [3.4.0]

- dependency lines plugin

## [3.3.7]

- check browser version

## [3.3.6]

- add item by id bugfix

## [3.3.5]

- invalid token error for license improvement

## [3.3.4]

- package.json update

## [3.3.3]

- readme update

## [3.3.2]

- current time with seconds and minutes bugfix

## [3.3.1]

- console.log removed 😏

## [3.3.0]

- `config.chart.calendarLevels.periodIncrement` as a number or function

## [3.2.19]

- package.json update

## [3.2.18]

- build version bugfix

## [3.2.17]

- build fix

## [3.2.16]

- gstc version inside `config.version` (readonly)

## [3.2.15]

- travis integration

## [3.2.14]

- gstc disappeared after a few seconds bugfix

## [3.2.13]

- scroll position was not updated properly

## [3.2.12]

- html is not defined bugfix

## [3.2.11]

- default configuration changed (precise vertical scroll = true now)

## [3.2.10]

- readme update (react, vue, angular examples)

## [3.2.9]

- dependencies updated
- removed resize-observer-polyfill

## [3.2.8]

- \*.map files removed

## [3.2.4]

- types in package.json updated

[3.2.5 - 3.2.7]

- html is not defined bugfix inside vue projects

## [3.2.3]

- do not exclude examples from npm package

## [3.2.2]

- plugins types bugfix

## [3.2.1]

- npmignore updated - do not delete ../gstc.d.ts (Cannot find module '../gstc' or its corresponding type declarations bugfix)

## [3.2.0]

- api plugin initialization - now all plugins must inform api about their initialization and destruction (api.pluginInitialized, api.pluginDestroyed, api.isPluginInitialized, api.getPluginsPositions, api.isPluginInitializedBefore)

## [3.1.8]

- auto scroll feature for item-resizing plugin - from now on item-resizing plugin must be initialized before item-movement plugin

## [3.1.7]

- list rows data children property was not calculated correctly

## [3.1.6]

- c_c_c is not defined bugfix

## [3.1.5]

- c_c_c is not defined bugfix

## [3.1.4]

- .npmignore added

## [3.1.3]

- readme update

## [3.1.2]

- just version update

## [3.1.1]

- visible items generation bugfix

## [3.1.0]

- auto-scroll feature for item-movement plugin

<br /><br /> \***breaking** in some situations - depends on user configuration - but must be changed due to bug fixing or make it much easier to use
