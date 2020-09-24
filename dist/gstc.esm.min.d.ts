import 'pepjs';
import { vido, lithtml, ComponentInstance } from '@neuronet.io/vido';
import { Api } from './api/api';
import { Dayjs, OpUnitType } from 'dayjs';
import { Properties as CSSProps } from 'csstype';
import DeepState from 'deep-state-observer';
export declare type Vido = vido<DeepState, Api>;
export interface RowDataPosition {
    top: number;
    topPercent: number;
    bottomPercent: number;
    viewTop: number;
}
export interface RowData {
    actualHeight: number;
    outerHeight: number;
    position: RowDataPosition;
    parents: string[];
    children: string[];
    items: string[];
}
export interface Row {
    id: string;
    parentId?: string;
    expanded?: boolean;
    height?: number;
    $data?: RowData;
    gap?: RowGap;
    style?: CSSProps;
    classNames?: string[] | classNamesFn;
    [key: string]: any;
}
export declare type classNamesFn = ({ row, vido }: {
    row: Row;
    vido: Vido;
}) => string[];
export interface Rows {
    [id: string]: Row;
}
export interface ItemTime {
    start: number;
    end: number;
}
export interface ItemDataTime {
    startDate: Dayjs;
    endDate: Dayjs;
}
export interface ItemDataPosition {
    left: number;
    actualLeft: number;
    right: number;
    actualRight: number;
    top: number;
    actualTop: number;
    viewTop: number;
}
export interface ItemData {
    time: ItemDataTime;
    actualHeight: number;
    outerHeight: number;
    position: ItemDataPosition;
    width: number;
    actualWidth: number;
    detached: boolean;
    linkedWith?: string[];
    dependant?: string[];
}
export interface ItemDataUpdate {
    time?: ItemDataTime;
    actualHeight?: number;
    outerHeight?: number;
    position?: ItemDataPosition;
    width?: number;
    actualWidth?: number;
    detached?: boolean;
    linkedWith?: string[];
    dependant?: string[];
}
export declare type ItemLabelFunction = ({ item, vido }: {
    item: Item;
    vido: Vido;
}) => lithtml.TemplateResult | string;
export interface Item {
    id: string;
    rowId: string;
    time: ItemTime;
    label: string | ItemLabelFunction;
    height?: number;
    top?: number;
    gap?: ItemGap;
    minWidth?: number;
    style?: CSSProps;
    classNames?: string[] | (({ item, vido }: {
        item: Item;
        vido: Vido;
    }) => string[]);
    isHTML?: boolean;
    linkedWith?: string[];
    selected?: boolean;
    [key: string]: any;
}
export interface Items {
    [id: string]: Item;
}
export interface GridCell {
    id: string;
    time: ChartTimeDate;
    top: number;
    row: Row;
    content: null | string | htmlResult;
    [key: string]: any;
}
export interface GridCells {
    [id: string]: GridCell;
}
export interface GridRow {
    row: Row;
    cells: string[];
    top: number;
    width: number;
}
export interface GridRows {
    [rowId: string]: GridRow;
}
export declare type VoidFunction = () => void;
export declare type PluginInitialization = (vido: Vido) => void | VoidFunction;
export declare type Plugin = <T>(options: T) => PluginInitialization;
export declare type htmlResult = lithtml.TemplateResult | lithtml.TemplateResult[] | lithtml.SVGTemplateResult | lithtml.SVGTemplateResult[] | undefined | null;
export declare type RenderFunction = (templateProps: unknown) => htmlResult;
export declare type Component = (vido: unknown, props: unknown) => RenderFunction;
export interface Components {
    [name: string]: Component;
}
export declare type SlotName = 'main' | 'scroll-bar' | 'list' | 'list-column' | 'list-column-header' | 'list-column-header-resizer' | 'list-column-row' | 'list-column-row-expander' | 'list-column-row-expander-toggle' | 'list-toggle' | 'chart' | 'chart-calendar' | 'chart-calendar-date' | 'chart-timeline' | 'chart-timeline-grid' | 'chart-timeline-grid-row' | 'chart-timeline-grid-row-cell' | 'chart-timeline-items' | 'chart-timeline-items-row' | 'chart-timeline-items-row-item';
export declare type SlotPlacement = 'outer' | 'inner' | 'container-outer' | 'container-inner' | 'content';
export declare type Slot = {
    [placement in SlotPlacement]?: Component[];
};
export declare type Slots = {
    [name in SlotName]?: Slot;
};
export interface ColumnResizer {
    width?: number;
    inRealTime?: boolean;
    dots?: number;
}
export declare type ColumnDataFunction = ({ row, vido }: {
    row: Row;
    vido: Vido;
}) => string | number;
export declare type ColumnDataFunctionString = ({ row, vido }: {
    row: Row;
    vido: Vido;
}) => string;
export declare type ColumnDataFunctionTemplate = ({ row, vido }: {
    row: Row;
    vido: Vido;
}) => htmlResult;
export declare type ColumnDataHeaderContent = string | (({ column, vido }: {
    column: ColumnData;
    vido: Vido;
}) => htmlResult);
export interface ColumnDataHeader {
    html?: htmlResult;
    content?: ColumnDataHeaderContent;
}
export declare type Sortable = string | ColumnDataFunction;
export interface ColumnData {
    id: string;
    data: string | ColumnDataFunctionString | ColumnDataFunctionTemplate;
    width: number;
    header: ColumnDataHeader;
    isHTML?: boolean;
    expander?: boolean;
    resizer?: boolean;
    sortable?: Sortable;
    minWidth?: number;
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
export interface RowGap {
    top?: number;
    bottom?: number;
}
export interface ListRow {
    height?: number;
    gap?: RowGap;
}
export interface SortIcons {
    up?: string;
    down?: string;
}
export interface Sort {
    icons?: SortIcons;
    compare?: null | ((column: ColumnData) => (a: Row, b: Row) => number);
    activeColumnId?: string | null;
    asc?: boolean;
}
export interface List {
    rows?: Rows;
    row?: ListRow;
    columns?: Columns;
    expander?: Expander;
    toggle?: ListToggle;
    sort?: Sort;
}
export interface ScrollPercent {
    top?: number;
    left?: number;
}
export interface ScrollType {
    size?: number;
    minInnerSize?: number;
    data?: Row | ChartTimeDate;
    posPx?: number;
    maxPosPx?: number;
    area?: number;
    areaWithoutLastPage?: number;
    precise?: boolean;
    lastPageSize?: number;
    lastPageCount?: number;
    dataIndex?: number;
    sub?: number;
    scrollArea?: number;
    innerSize?: number;
    multiplier?: number;
    offset?: number;
}
export interface ScrollTypeHorizontal extends ScrollType {
    data?: ChartTimeDate;
}
export interface ScrollTypeVertical extends ScrollType {
    data?: Row;
}
export interface Scroll {
    bodyClassName?: string;
    horizontal?: ScrollTypeHorizontal;
    vertical?: ScrollTypeVertical;
}
export interface ChartTimeDate extends DataChartTimeLevelDate {
}
export declare type ChartTimeDates = ChartTimeDate[];
export declare type ChartTimeOnLevelDatesArg = {
    dates: DataChartTimeLevel;
    time: DataChartTime;
    format: ChartCalendarLevelFormat;
    level: ChartCalendarLevel;
    levelIndex: number;
};
export declare type ChartTimeOnLevelDates = (arg: ChartTimeOnLevelDatesArg) => DataChartTimeLevel;
export declare type ChartTimeOnDateArg = {
    date: ChartTimeDate;
    time: DataChartTime;
    format: ChartCalendarLevelFormat;
    level: ChartCalendarLevel;
    levelIndex: number;
};
export declare type ChartTimeOnDate = (arg: ChartTimeOnDateArg) => ChartTimeDate | null;
export interface ChartTime {
    period?: Period;
    from?: number;
    readonly fromDate?: Dayjs;
    to?: number;
    readonly toDate?: Dayjs;
    zoom?: number;
    level?: number;
    leftGlobal: number;
    readonly leftGlobalDate?: Dayjs;
    centerGlobal?: number;
    readonly centerGlobalDate?: Dayjs;
    rightGlobal?: number;
    readonly rightGlobalDate?: Dayjs;
    format?: ChartCalendarLevelFormat;
    levels?: ChartTimeDates[];
    additionalSpaces?: ChartCalendarAdditionalSpaces;
    calculatedZoomMode?: boolean;
    onLevelDates?: ChartTimeOnLevelDates[];
    onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
    onDate?: ChartTimeOnDate[];
    readonly allDates?: ChartTimeDates[];
    forceUpdate?: boolean;
    readonly additionalSpaceAdded?: boolean;
}
export interface DataChartTimeLevelDateCurrentView {
    leftPx: number;
    rightPx: number;
    width: number;
}
export interface DataChartTimeLevelDate {
    leftGlobal: number;
    leftGlobalDate: Dayjs;
    rightGlobal: number;
    rightGlobalDate: Dayjs;
    width: number;
    leftPx: number;
    rightPx: number;
    period: Period;
    formatted: string | htmlResult;
    current: boolean;
    next: boolean;
    previous: boolean;
    currentView?: DataChartTimeLevelDateCurrentView;
    leftPercent?: number;
    rightPercent?: number;
}
export declare type DataChartTimeLevel = DataChartTimeLevelDate[];
export interface DataChartTime extends ChartTime {
    period: Period;
    leftGlobal: number;
    leftGlobalDate: Dayjs | undefined;
    centerGlobal: number;
    centerGlobalDate: Dayjs | undefined;
    rightGlobal: number;
    rightGlobalDate: Dayjs | undefined;
    timePerPixel: number;
    from: number;
    fromDate: Dayjs | undefined;
    to: number;
    toDate: Dayjs | undefined;
    totalViewDurationMs: number;
    totalViewDurationPx: number;
    leftInner: number;
    rightInner: number;
    leftPx: number;
    rightPx: number;
    width?: number;
    scrollWidth?: number;
    zoom: number;
    format: ChartCalendarLevelFormat;
    level: number;
    levels: DataChartTimeLevel[];
    additionalSpaces?: ChartCalendarAdditionalSpaces;
    calculatedZoomMode?: boolean;
    onLevelDates?: ChartTimeOnLevelDates[];
    onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
    allDates?: ChartTimeDates[];
    forceUpdate?: boolean;
    recalculateTimesLastReason?: string;
}
export interface ChartCalendarFormatArguments {
    timeStart: Dayjs;
    timeEnd: Dayjs;
    className: string;
    props: any;
    vido: any;
}
export declare type PeriodString = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export declare type Period = PeriodString | OpUnitType;
export interface ChartCalendarLevelFormat {
    zoomTo: number;
    period: Period;
    periodIncrement: number;
    main?: boolean;
    classNames?: string[];
    format: (args: ChartCalendarFormatArguments) => string | htmlResult;
}
export interface ChartCalendarAdditionalSpace {
    before: number;
    after: number;
    period: Period;
}
export interface ChartCalendarAdditionalSpaces {
    hour?: ChartCalendarAdditionalSpace;
    day?: ChartCalendarAdditionalSpace;
    week?: ChartCalendarAdditionalSpace;
    month?: ChartCalendarAdditionalSpace;
    year?: ChartCalendarAdditionalSpace;
}
export declare type ChartCalendarLevel = ChartCalendarLevelFormat[];
export interface GridCellOnCreateArgument extends GridCell {
    vido: Vido;
}
export declare type GridCellOnCreate = (cell: GridCellOnCreateArgument) => string | htmlResult;
export interface ChartGridCell {
    onCreate: GridCellOnCreate[];
}
export interface ChartGrid {
    cell?: ChartGridCell;
}
export interface ItemGap {
    top?: number;
    bottom?: number;
}
export interface CutIcons {
    left?: string;
    right?: string;
}
export interface DefaultItem {
    gap?: ItemGap;
    height?: number;
    top?: number;
    minWidth?: number;
    cutIcons?: CutIcons;
}
export interface Chart {
    time?: ChartTime;
    calendarLevels?: ChartCalendarLevel[];
    grid?: ChartGrid;
    items?: Items;
    item?: DefaultItem;
    spacing?: number;
}
export interface ActionFunctionResult {
    update?: (element: HTMLElement, data: unknown) => void;
    destroy?: (element: HTMLElement, data: unknown) => void;
}
export declare type Action = (element: HTMLElement, data: unknown) => ActionFunctionResult | void;
export declare type Actions = {
    [name in SlotName]?: Action[];
};
export interface Locale {
    name: string;
    weekdays?: string[];
    months?: string[];
    weekStart?: number;
    weekdaysShort?: string[];
    monthsShort?: string[];
    weekdaysMin?: string[];
    ordinal?: (n: number) => number | string;
    formats: Partial<{
        LT: string;
        LTS: string;
        L: string;
        LL: string;
        LLL: string;
        LLLL: string;
    }>;
    relativeTime: Partial<{
        future: string;
        past: string;
        s: string;
        m: string;
        mm: string;
        h: string;
        hh: string;
        d: string;
        dd: string;
        M: string;
        MM: string;
        y: string;
        yy: string;
    }>;
}
export interface Config {
    licenseKey: string;
    debug?: boolean;
    plugins?: PluginInitialization[];
    plugin?: unknown;
    innerHeight?: number;
    headerHeight?: number;
    components?: Components;
    slots?: Slots;
    list?: List;
    scroll?: Scroll;
    chart?: Chart;
    actions?: Actions;
    locale?: Locale;
    utcMode?: boolean;
    merge?: (target: object, source: object) => object;
    useLast?: boolean;
    Promise?: Promise<unknown> | any;
    mute?: string[];
}
export interface TreeMapData {
    parents: string[];
    children: Row[];
    items: Item[];
}
export interface TreeMap {
    id: string;
    $data: TreeMapData;
}
export interface DataList {
    width: number;
    visibleRows: string[];
    visibleRowsHeight: number;
    rowsWithParentsExpanded: string[];
    rowsHeight: number;
}
export interface Dimensions {
    width: number;
    height: number;
}
export interface DataChartDimensions extends Dimensions {
    innerWidth: number;
}
export interface DataGrid {
    cells: GridCells;
    rows: GridRows;
}
export interface DataItems {
    [id: string]: ItemData;
}
export interface DataChart {
    grid: DataGrid;
    items: DataItems;
    dimensions: DataChartDimensions;
    visibleItems: Item[];
    time: DataChartTime;
}
export interface DataElements {
    [key: string]: HTMLElement;
}
export interface Data {
    treeMap: TreeMap;
    list: DataList;
    dimensions: Dimensions;
    chart: DataChart;
    elements: DataElements;
}
export interface Reason {
    name: string;
    oldValue?: unknown;
    newValue?: unknown;
    from?: number;
    to?: number;
}
export interface GSTCOptions {
    state: DeepState;
    element: HTMLElement;
    debug?: boolean;
}
export interface GSTCResult {
    state: DeepState;
    api: Api;
    component: ComponentInstance;
    destroy: () => void;
    reload: () => void;
}
declare function GSTC(options: GSTCOptions): GSTCResult;
declare namespace GSTC {
    var api: {
        name: string;
        GSTCID(originalId: string): string;
        isGSTCID(id: string): boolean;
        sourceID(id: string): string;
        fromArray(array: any): {};
        stateFromConfig: typeof import("./api/api").stateFromConfig;
        wasmStateFromConfig: typeof import("./api/api").wasmStateFromConfig;
        merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        lithtml: typeof lithtml;
        html: typeof lithtml;
        date(time: any): Dayjs;
        setPeriod(period: OpUnitType): number;
        dayjs: typeof import("dayjs");
    };
}
export default GSTC;
