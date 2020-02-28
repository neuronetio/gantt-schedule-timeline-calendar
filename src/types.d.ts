import Vido, { lithtml, vido } from '@neuronet.io/vido';
import { Dayjs } from 'dayjs/index.d';

export interface Row {
  id: string;
  parentId?: string;
  expanded?: boolean;
}

export interface Rows {
  [id: string]: Row;
}

export interface ItemTime {
  start: number;
  end: number;
}

export interface Item {
  id: string;
  rowId: string;
  time: ItemTime;
  label: string;
}

export interface Items {
  [id: string]: Item;
}

export type VoidFunction = () => void;
export type PluginInitialization = (vido: unknown) => void | VoidFunction;
export type Plugin = <T>(options: T) => PluginInitialization;
export type htmlResult = lithtml.TemplateResult | lithtml.SVGTemplateResult | undefined;
export type RenderFunction = (templateProps: unknown) => htmlResult;
export type Component = (vido: unknown, props: unknown) => RenderFunction;
export interface Components {
  [name: string]: Component;
}
export type Wrapper = (input: htmlResult) => htmlResult;
export interface Wrappers {
  [name: string]: Wrapper;
}

export interface Slot {
  [key: string]: htmlResult[];
}
export interface Slots {
  [name: string]: Slot;
}

export interface ColumnResizer {
  width?: number;
  inRealTime?: boolean;
  dots?: number;
}
export type ColumnDataFunctionString = (row: Row) => string;
export type ColumnDataFunctionTemplate = (row: Row) => htmlResult;
export interface ColumnDataHeader {
  html?: htmlResult;
  content?: string;
}
export interface ColumnData {
  id: string;
  data: string | ColumnDataFunctionString | ColumnDataFunctionTemplate;
  isHTML: boolean;
  width: number;
  header: ColumnDataHeader;
  expander: boolean;
}
export interface ColumnsData {
  [id: string]: ColumnData;
}
export interface Columns {
  percent?: number;
  resizer?: ColumnResizer;
  minWidth?: number;
  data?: ColumnsData;
}
export interface ExpanderIcon {
  width?: number;
  height?: number;
}
export interface ExpanderIcons {
  child?: string;
  open?: string;
  closed?: string;
}

export interface Expander {
  padding?: number;
  size?: number;
  icon?: ExpanderIcon;
  icons?: ExpanderIcons;
}
export interface ListToggleIcons {
  open?: string;
  close?: string;
}
export interface ListToggle {
  display?: boolean;
  icons?: ListToggleIcons;
}
export interface List {
  rows?: Rows;
  rowHeight?: number;
  columns?: Columns;
  expander?: Expander;
  toggle?: ListToggle;
}

export interface ScrollPercent {
  top?: number;
  left?: number;
}
export interface ScrollCompensation {
  x: number;
  y: number;
}
export interface Scroll {
  smooth?: boolean;
  top?: number;
  left?: number;
  xMultiplier?: number;
  yMultiplier?: number;
  percent: ScrollPercent;
  compensation: ScrollCompensation;
}

export interface ChartTimeDate {}
export type ChartTimeDates = ChartTimeDate[];
export interface ChartTimeMaxWidth {
  [period: string]: number;
}
export interface ChartTime {
  from?: number;
  to?: number;
  zoom?: number;
  format?: ChartCalendarFormat;
  levels?: ChartTimeDates[];
  maxWidth?: ChartTimeMaxWidth;
}
export interface ChartCalendarFormatArguments {
  timeStart: Dayjs;
  timeEnd: Dayjs;
  className: string;
  props: any;
  vido: vido;
}
export type Period = 'year' | 'month' | 'week' | 'day' | 'hour';
export interface ChartCalendarFormat {
  zoomTo: number;
  period: Period;
  default?: boolean;
  className?: string;
  format: (arguments: ChartCalendarFormatArguments) => string | htmlResult;
}
export interface ChartCalendarLevel {
  formats?: ChartCalendarFormat[];
  main?: boolean;
  doNotUseCache?: boolean;
}
export interface ChartCalendar {
  levels?: ChartCalendarLevel[];
  expand?: boolean;
}
export interface ChartGridBlock {
  onCreate: ((block) => unknown)[];
}
export interface ChartGrid {
  block?: ChartGridBlock;
}
export interface Chart {
  time?: ChartTime;
  calendar?: ChartCalendar;
  grid?: ChartGrid;
  items?: Items;
  spacing?: number;
}

export interface ClassNames {
  [componentName: string]: string;
}

export interface ActionFunctionResult {
  update?: (element: HTMLElement, data: unknown) => void;
  destroy?: (element: HTMLElement, data: unknown) => void;
}
export type Action = (element: HTMLElement, data: unknown) => ActionFunctionResult | void;
export interface Actions {
  [name: string]: Action[];
}

export interface LocaleRelativeTime {
  future?: string;
  past?: string;
  s?: string;
  m?: string;
  mm?: string;
  h?: string;
  hh?: string;
  d?: string;
  dd?: string;
  M?: string;
  MM?: string;
  y?: string;
  yy?: string;
}
export interface LocaleFormats {
  LT?: string;
  LTS?: string;
  L?: string;
  LL?: string;
  LLL?: string;
  LLLL?: string;
  [key: string]: string;
}
export interface Locale {
  name?: string;
  weekdays?: string[];
  weekdaysShort?: string[];
  weekdaysMin?: string[];
  months?: string[];
  monthsShort?: string[];
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  relativeTime?: LocaleRelativeTime;
  formats?: LocaleFormats;
  ordinal?: (n: number) => string;
}

export interface Config {
  plugins?: Plugin[];
  plugin?: unknown;
  height?: number;
  headerHeight?: number;
  components?: Components;
  wrappers?: Wrappers;
  slots?: Slots;
  list?: List;
  scroll?: Scroll;
  chart?: Chart;
  classNames?: ClassNames;
  actions?: Actions;
  locale?: Locale;
  utcMode?: boolean;
  usageStatistics?: boolean;
}
