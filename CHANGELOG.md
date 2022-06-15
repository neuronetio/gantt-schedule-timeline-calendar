[3.1.0]

- auto-scroll feature for item-movement plugin

[3.1.1]

- visible items generation bugfix

[3.1.2]

- just version update

[3.1.3]

- readme update

[3.1.4]

- .npmignore added

[3.1.5]

- c_c_c is not defined bugfix

[3.1.6]

- c_c_c is not defined bugfix

[3.1.7]

- list rows data children property was not calculated correctly

[3.1.8]

- auto scroll feature for item-resizing plugin - from now on item-resizing plugin must be initialized before item-movement plugin

[3.2.0]

- api plugin initialization - now all plugins must inform api about their initialization and destruction (api.pluginInitialized, api.pluginDestroyed, api.isPluginInitialized, api.getPluginsPositions, api.isPluginInitializedBefore)

[3.2.1]

- npmignore updated - do not delete ../gstc.d.ts (Cannot find module '../gstc' or its corresponding type declarations bugfix)

[3.2.2]

- plugins types bugfix

[3.2.3]

- do not exclude examples from npm package

[3.2.4]

- types in package.json updated

[3.2.5 - 3.2.7]

- html is not defined bugfix inside vue projects

[3.2.8]

- \*.map files removed

[3.2.9]

- dependencies updated
- removed resize-observer-polyfill

[3.2.10]

- readme update (react, vue, angular examples)

[3.2.11]

- default configuration changed (precise vertical scroll = true now)

[3.2.12]

- html is not defined bugfix

[3.2.13]

- scroll position was not updated properly

[3.2.14]

- gstc disappeared after a few seconds bugfix

[3.2.15]

- travis integration

[3.2.16]

- gstc version inside `config.version` (readonly)

[3.2.17]

- build fix

[3.2.18]

- build version bugfix

[3.2.19]

- package.json update

[3.3.0]

- `config.chart.calendarLevels.periodIncrement` as a number or function

[3.3.1]

- console.log removed 😏

[3.3.2]

- current time with seconds and minutes bugfix

[3.3.3]

- readme update

[3.3.4]

- package.json update

[3.3.5]

- invalid token error for license improvement

[3.3.6]

- add item by id bugfix

[3.3.7]

- check browser version

[3.4.0]

- dependency lines plugin

[3.4.1]

- build bugfix

[3.4.2]

- readme update

[3.4.3]

- moved tests to tests dir and linked examples

[3.4.4]

- moved tests to examples dir 😏

[3.4.5]

- file:/// protocol warning (gstc will not work with local files)
- #204 bugfix

[3.4.6]

- dependency lines plugin should not display lines if items are outside of the whole timeline (not current view)
- throw more reasonable error when there is no item or cell with specified id when selecting
- getAllGridCells and getAllGridRows added in gstc instance api
- a full reload was fired when it shouldn't (bugfix)
- deep-state-library updated with couple of bugfixes

[3.4.7]

- console.log removed...
- invalid row height and disappearing overlapping items bugfix

[3.4.8]

- remove handles from item when selected property was set to false (ItemResizing plugin bugfix)
- more responsive item property watcher
- invalid item position caused by DependencyLines plugin (bugfix)

[3.5.0]

- Component templates support (for item only just for now)
- ItemTypes plugin

[3.5.1]

- ItemTypes plugin is now compatible with item slots

[3.5.2]

- changed slot a little bit so ItemTypes plugin can work with ItemResizer plugin (inside item)

[3.5.3]

- rows height calculation bugfix

[3.5.4]

- ProgressBar width bugfix

[3.5.5]

- ProgressBar width bugfix

[3.6.0]

- Code refactoring
- gstc.api.getCurrentCalendarLevels method added
- #213 sorting bugfix
- load performance optimization (`state.update('config', ...)`, `state.update('config.list.rows',...)` and `state.update('config.chart.items',...)` also)
- #202 fixed

[3.6.1]

- `This domain is not registered for your license ( undefined ).` bugfix

[3.6.2]

- #216 bugfix

[3.6.3]

- #217 bugfix

[3.6.4]

- types improvement

[3.6.5]

- npm update
- minor types update

[3.6.6]

- performance
- plugins destroy bugfix

[3.7.0]

- offline licenses
- minified code undefined variables bugfix

[3.7.1]

- license info stored in state (`state.get('license')`)
- grid cells bugfix

[3.7.2]

- #275 bugfix (wrong right position of the item in calculatedTimeZoom mode)

[3.7.3]

- cache calculation bugfix (chart not responding to all changes)

[3.7.4]

- cut items to last date

[3.7.5]

- right arrow not appearing in some circumstances bugfix

[3.7.6]

- ItemResizing plugin handle content improvement (function | object) with left and right values

[3.7.7]

- gstc.api.render() method added to refresh the view if needed

[3.7.8]

- Selection plugin: changed path from `gstc.api.plugins.selection` to `gstc.api.plugins.Selection`
- Selection plugin: added ITEM and CELL string to api

[3.7.9]

- performance optimization

[3.7.10]

- (code cleanup) some properties from `config.scroll` moved to `$data.scroll`
- (code cleanup) `config.items.*.selected` and `config.items.*.selecting` moved to `$data.items.*.selected` and `$data.items.*.selecting`
- minor performance improvements

[3.7.11]

- console.log :/

[3.7.12]

- `gstc-loaded` event bugfix and it fires only once to listen config changes just subscribe `state.subscribe('config;', ()=>{ console.log('gstc reloaded') })`

[3.7.13]

- performance optimization

[3.7.14]

- selection plugin not selecting grid cells bugfix

[3.7.15]

- changing columns bugfix (#278)

[3.7.16]

- added `hidden` to the column data to easily hide column without changing data
- added `position` to show columns in specified order

[3.8.0]

- innerHeight bugfix (#242)
- automatic innerHeight feature (#276)

[3.8.1]

- wrong scroll position after changing innerHeight bugfix

[3.8.2]

- `autoInnerHeight` bugfix when `innerHeight` is not specified
- horizontal scroll goes to vertical scroll position when window is resized with `autoInnerHeight` option enabled bugfix

[3.8.3]

- add row by id bugfix
- scroll area watching bugfix

[3.8.4]

- add item by id bugfix (#286)

[3.9.0]

- deep-state-observer updated
- classes on the DOM Element is not displaying `id`s to improve performance a lot

[3.9.1]

- `deep-state-observer` updated

[3.9.2]

- `deep-state-observer` updated
- gstcInstance.api.setScrollTop now accepts `number` (for row index inside rows with parents expanded array) and `string` for rowId

[3.9.3]

- `DeepState`, `Api`, `publicApi`, `CSSProps`, `ComponentInstance` types added

[3.10.0]

- vido updated

[3.10.1]

- move dependant items only when time was changed bugfix

[3.10.2]

- jest testing engine updated

[3.10.3]

- do not expand view while resizing or moving in `config.chart.time.calculatedZoomMode`

[3.10.4]

- time bookmarks plugin custom `className` not appearing bugfix

[3.11.0]

- `config.templates` configuration added - now you can use templates for all components

[3.11.1]

- bookmarks plugin `className` bugfix

[3.11.2]

- bookmarks improved (show only bookmarks that are in current view)

[3.11.3]

- itemMovement & itemResizing update state bugfix
- calendar dates with wrong widths when week or non standard period is used as main date bugfix (#294)

[3.11.4]

- vido updated (StyleMap bugfix)

[3.12.0]

- `ExportImage` plugin added

[3.13.0]

- `ExportPDF` plugin added

[3.13.1]

- item `minWidth` bugfix (#296)

[3.13.2]

- loading big data set is a little bit faster now

[3.13.3]

- working with bigger data set is now much faster

[3.13.4]

- vertical scrollbar weird behavior at the end of the scroll area fixed

[3.14.0]

- huge performance improvement
- fixed rows sorting (#297)
- horizontal scroll precise option implemented

[3.14.1]

- timeline pointer plugin precise position bugfix

[3.14.2]

- bookmarks style option added and changed DOM position

[3.14.3]

- bookmarks DOM divided into two parts
- chart overflow visible changed back to hidden

[3.14.4]

- time diff bugfix

[3.14.5]

- `config.chart.item.overlap` option added

[3.14.6]

- `config.chart.time.calendarLevels -> periodIncrement` `leftDate` argument changed to `date`

[3.14.7]

- scroll bar pointer events works on touch devices now

[3.14.8]

- grid cells cache bugfix

[3.14.9]

- performance optimizations
- scrollbar visibility bugfix when all dates are visible bugfix
- grid cells cache bugfix

[3.14.10]

- cell content bugfix

[3.14.11]

- Math.round for all css positions
- bookmark height bugfix

[3.14.12]

- a little bit of optimization again

[3.14.13]

- grid cells cache bugfix

[3.14.14]

- when scroll position is higher than number of rows visible rows not showing up bugfix
- when `time.from` and `time.to` are not set when changing data nothing shows up bugfix
- huge performance optimizations

[3.14.15]

- performance optimization
- row items pointer events bugfix
- detach directive removed (cache directive is a better alternative)

[3.14.16]

- selection plugin optimization and item is returned in event (not `itemData`)
- state now contains license information `state.get('license')`
- item movement improved

[3.14.17]

- fixed missing `cache` list template variable
- added `additionalSpace` useful when we want to add new content above and below chart (see `messing-with-templates` example)

[3.14.18]

- style updated: list position is now `relative`

[3.14.19]

- sorting nested rows bugfix (#303)

[3.14.20]

- `ItemMovement` and `ItemResizing` DST (Daylight saving time) bugfix

[3.14.21]

- horizontal scroll bar last position was not accessible bugfix

[3.14.22]

- horizontal scroll bar positive precise offset bugfix

[3.14.23]

- `data-gstcid` added to some elements
- cypress testing framework added

[3.14.24]

- tests improved

[3.14.25]

- column header render template bugfix

[3.14.26]

- calendar levels bugfix
- tests improvements

[3.14.27]

- resizing handles not visible when using item-types plugin and width is below threshold bugfix (#226)
- item tests improved
- testing in chrome and firefox

[3.14.28]

- removed firefox from default testing because in some env actual firefox is not installed and tests cannot be executed
- added `npm run test:full` to test on firefox also

[3.14.29]

- dates generation bugfix

[3.14.30]

- change column visibility bugfix

[3.14.31]

- updated rows were visible only after scroll bugfix

[3.14.32]

- test command updated (nodejs 17.x `Error: error:0308010C:digital envelope routines::unsupported` bugfix)

[3.14.33]

- cleaning up chart dimensions properties
- other package.json cypress commands updated (nodejs 17.x `Error: error:0308010C:digital envelope routines::unsupported` bugfix)

[3.14.34]

- tests updated

[3.14.35]

- tests updated

[3.14.36]

- tests updated

[3.14.37]

- tests updated

[3.14.38]

- `.eslintignore` added

[3.14.39]

- `.eslintignore` removed and added ingore pattern to `.eslintrc.json`
- tests updated

[3.14.40]

- tests updated

[3.14.41]

- cypress updated
- timeline bookmarks tests added
- added `isInCurrentView` in time api
- fixed #319

[3.14.42]

- csstype junk removed

[3.14.43]

- utc mode bugfix #321
- utc mode tests added
- added `"@cypress/request": "2.88.7"` to `package.json` because of [this cypress bug](https://github.com/cypress-io/cypress/issues/19097)

[3.14.44]

- added timezone to travis
- do not upload videos if test is successful (cypress option added)

[3.14.45]

- added before_script to travis to set timezone properly

[3.14.46]

- updated `@cypress/request` to `2.88.9`

[3.14.47]

- fixed travis yml file needed to run tests in CI

[3.14.48]

- grid cells cache bugfix
- dependency lines bugfix
- fixed issue with `calculatedZoomMode` change (#316)

[3.14.49]

- `scrollToTime` centered bugfix

[3.15.0]

- license key checking mechanism updated to v3

[3.15.1]

- package.json updated

[3.15.2]

- package.json updated

[3.15.3]

- empty chart after updating rows bugfix

[3.15.4]

- bad scroll position after changing chart width bugfix
- moving item outside of the current time resets scroll position bugfix

[3.15.5]

- types renamed from `*.d.ts` to `min.d.ts`

[3.15.6]

- fixed missing api types

[3.15.7]

- fixed column header resizing dots disappearing when width was smaller than text (#322)

[3.15.8]

- cypress updated to 9.2.0
- updating locale bugfix (#230)

[3.16.0]

- removed junk dev dependencies
- added dark theme support
- fixed calculatedZoomMode initial render

[3.16.1]

- scroll bar handle more visible in dark mode
- main import file with wasm file included

[3.16.2]

- #325 bugfix (dayjs.locale is not a function)
- ability to use component on external servers on premise with domain keywords like app-name.\*
- fixed bug when moving items outside a view

[3.16.3]

- fixed bug 'Cannot read properties of undefined (reading leftPx)' when moving item outside view with autoscrolling enabled

[3.16.4]

- itemMovement `ignoreMissingDates` option added
- itemMovement wrong item width bug fixed

[3.16.5]

- itemMovement plugin - item jumps over one cell when dragging bugfix

[3.16.6]

- itemResizing plugin - item resizing wrong width calculation bugfix

[3.17.0]

- itemResizing and itemMovement - item time calculation bugfix
- config.chart.time.additionalChartSpaces removed (was not documented)
- time calculation now works better with removed dates by the user (onLevelDates event)
- added duration dayjs plugin loaded by default
- spacing is no longer taking into account with item.width - now it is full width without subtracting spacing (1px) for itemData.width and itemData.actualWidth
- default spacing is set to 4 instead of 1 (looks better) `config.chart.spacing`
