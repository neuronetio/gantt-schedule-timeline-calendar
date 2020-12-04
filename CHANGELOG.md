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
