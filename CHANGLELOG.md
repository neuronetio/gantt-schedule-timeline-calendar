# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2020-01-27

### Added

- WeekendHighlight plugin

## [1.2.0] - 2020-02-11

- Selection plugin bugfix (cannot select from right bottom to left top)
- ItemMovement plugin data improvement

## [1.3.3] - 2020-02-24

- replace all rows and items bugfix

## [1.3.4]

- list rows not hidding bugfix #42

## [2.0.0]

- calendar dates and timeline period mechanism refactored

## [2.1.0]

- default periods - ability to change period
- config.chart.time reactivity bugfix
- calendar config improvements (config.chart.calendar.levels) - you can now specify formats and periods for each level of calendar
- calendar - you can turn of timeline / calendar expanding option to fill (or not) free space

## [2.1.1]

- [bugfix] empty items breaks time calculation at first load -> second load with items

## [2.1.2]

- [bugfix] recalculate time when items are reloaded
- calendar appearance improvement

## [2.1.3]

- console.log removed :/

## [2.2.0]

- [feature] before and after additional time configuration [chart.calendar.level.additionalTime]
- [typo] ItemMovement plugin resizeable => resizable
- [bugfix] hour view infinite loop in some conditions

## [2.2.1]

- readme update

## [2.3.0]

- config.chart.calendar.levels[].additionalSpace configuration moved to config.chart.calendar.additionalSpace
- additional space performance optimisation
- more precise grid block identification for lower resolution periods in YYYY-MM-DD HH:mm format

## [2.4.0]

- api.scrollToTime(timeInMs) method added
- fixed date position while zooming

## [2.4.1]

- visual improvements

## [2.4.2]

- visual improvements

## [2.4.3]

- default day zoom changed

## [2.4.4]

- visual improvements

## [2.4.5]

- config.scroll.propagate option
