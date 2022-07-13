/**
 * Gantt-Schedule-Timeline-Calendar component
 *
 * @header  --gstc--header--
 */
import type { vido } from '@neuronet.io/vido';
import { StyleInfo, ComponentInstance, lithtml } from '@neuronet.io/vido';
import { Api } from './api/api';
import { Dayjs } from 'dayjs';
import DeepState from 'deep-state-observer';
export declare type Vido = vido<DeepState, Api>;
export interface RowDataPosition {
    top: number;
    bottom: number;
}
export interface RowData {
    id: string;
    parentId: string | undefined;
    actualHeight: number;
    outerHeight: number;
    position: RowDataPosition;
    parents: string[];
    children: string[];
    allChildren: string[];
    items: string[];
    inView: boolean;
    parentsExpanded: boolean;
}
export interface RowsData {
    [key: string]: RowData;
}
export interface Row {
    id: string;
    parentId?: string;
    expanded?: boolean;
    height?: number;
    gap?: RowGap;
    style?: StyleInfo;
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
    rowTop: number;
    top: number;
    actualRowTop: number;
    viewTop: number;
}
export interface ItemDataIutOfView {
    left: boolean;
    right: boolean;
    whole: boolean;
}
export interface ItemData {
    id: string;
    time: ItemDataTime;
    actualHeight: number;
    outerHeight: number;
    position: ItemDataPosition;
    outOfView: ItemDataIutOfView;
    width: number;
    actualWidth: number;
    timeWidth: number;
    detached: boolean;
    linkedWith?: string[];
    dependant?: string[];
    visible?: boolean;
    inView?: boolean;
    selected?: boolean;
    selecting?: boolean;
}
export interface ItemDataUpdate {
    time?: ItemDataTime;
    actualHeight?: number;
    outerHeight?: number;
    position?: ItemDataPosition;
    width?: number;
    actualWidth?: number;
    timeWidth?: number;
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
    style?: StyleInfo;
    classNames?: string[] | (({ item, vido }: {
        item: Item;
        vido: Vido;
    }) => string[]);
    isHTML?: boolean;
    linkedWith?: string[];
    selected?: boolean;
    overlap?: boolean;
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
    rowData: RowData;
    content: null | string | htmlResult;
    [key: string]: any;
}
export interface GridCells {
    [id: string]: GridCell;
}
export interface GridRow {
    row: Row;
    rowData: RowData;
    cells: string[];
    top: number;
}
export interface GridRows {
    [rowId: string]: GridRow;
}
export declare type VoidFunction = () => void;
export declare type PluginInitialization = (vido: Vido) => void | VoidFunction;
export declare type Plugin = <T>(options: T) => PluginInitialization;
export declare type htmlResult = lithtml.TemplateResult | lithtml.TemplateResult[] | lithtml.SVGTemplateResult | lithtml.SVGTemplateResult[] | string | Element | undefined | null;
export declare type RenderFunction = (templateProps: unknown) => htmlResult;
export declare type Component = (vido: unknown, props: unknown) => RenderFunction;
export interface Components {
    [name: string]: Component;
}
export declare type SlotName = 'main' | 'scroll-bar' | 'list' | 'list-column' | 'list-column-headers' | 'list-column-header' | 'list-column-header-resizer' | 'list-column-rows' | 'list-column-row' | 'list-column-row-expander' | 'list-column-row-expander-toggle' | 'list-toggle' | 'chart' | 'chart-calendar' | 'chart-calendar-date' | 'chart-timeline' | 'chart-timeline-grid' | 'chart-timeline-grid-row' | 'chart-timeline-grid-row-cell' | 'chart-timeline-items' | 'chart-timeline-items-row' | 'chart-timeline-items-row-item';
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
    hidden?: boolean;
    position?: number;
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
export interface ScrollType {
    width?: number;
    minInnerSize?: number;
    precise?: boolean;
    multiplier?: number;
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
export interface DataScrollValues {
    lastPageSize: number;
    lastPageCount: number;
    absolutePosPx: number;
    preciseOffset: number;
    handlePosPx: number;
    maxHandlePosPx: number;
    absoluteSizeWithoutLastPage?: number;
    absoluteSize: number;
    scrollSize: number;
    innerHandleSize: number;
    dataIndex: number;
    dataId: string;
    visible: boolean;
    percent: number;
}
export interface DataScrollHorizontal extends DataScrollValues {
    data: ChartTimeDate;
}
export interface DataScrollVertical extends DataScrollValues {
    data: Row;
}
export interface DataScroll {
    horizontal: DataScrollHorizontal;
    vertical: DataScrollVertical;
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
    leftGlobal?: number;
    readonly leftGlobalDate?: Dayjs;
    centerGlobal?: number;
    readonly centerGlobalDate?: Dayjs;
    rightGlobal?: number;
    readonly rightGlobalDate?: Dayjs;
    format?: ChartCalendarLevelFormat;
    calculatedZoomMode?: boolean;
    onLevelDates?: ChartTimeOnLevelDates[];
    onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
    onDate?: ChartTimeOnDate[];
    readonly allDates?: ChartTimeDates[];
    readonly forceUpdate?: boolean;
    autoExpandTimeFromItems?: boolean;
    alignLevelsToMain?: boolean;
    readonly timePerPixel?: number;
    checkCurrentDateInterval?: number;
    readonly datesCache?: DataChartTimeDatesCache;
}
export interface DataChartTimeLevelDateCurrentView {
    leftPx: number;
    rightPx: number;
    width: number;
    leftGlobalDate: Dayjs;
    rightGlobalDate: Dayjs;
    durationMs: number;
}
export interface DataChartTimeLevelDateDST {
    diffMs: number;
    afterDate: Dayjs;
    afterTime: number;
}
export interface DataChartTimeLevelDate {
    id: string;
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
    periodIncrementedBy: number;
    DST: DataChartTimeLevelDateDST;
}
export declare type DataChartTimeLevel = DataChartTimeLevelDate[];
export declare type DataChartTimeLevels = DataChartTimeLevel[];
export declare type DataChartTimeDatesCacheDate = DataChartTimeLevelDate;
export interface DataChartTimeDatesCacheLevel {
    leftTime: number;
    rightTime: number;
    dates: DataChartTimeDatesCacheDate[];
}
export interface DataChartTimeDatesCache {
    timePerPixel: number;
    levels: DataChartTimeDatesCacheLevel[];
}
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
    leftPx: number;
    rightPx: number;
    width?: number;
    zoom: number;
    format: ChartCalendarLevelFormat;
    level: number;
    levels: DataChartTimeLevels;
    currentZoomLevelFormatting: ChartCalendarLevelFormat[];
    calculatedZoomMode?: boolean;
    onLevelDates?: ChartTimeOnLevelDates[];
    onCurrentViewLevelDates?: ChartTimeOnLevelDates[];
    allDates?: ChartTimeDates[];
    forceUpdate?: boolean;
    recalculateTimesLastReason?: string;
    datesCache: DataChartTimeDatesCache;
}
export interface ChartCalendarFormatArguments {
    timeStart: Dayjs;
    timeEnd: Dayjs;
    className: string;
    props: any;
    vido: any;
}
export declare type Period = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export declare type CharCalendarLevelFormatFunction = ({ currentDates, date, leftDate, rightDate, period, level, levelIndex, time, vido, api, }: {
    currentDates: DataChartTimeLevelDate[];
    date: Dayjs;
    leftDate: Dayjs;
    rightDate: Dayjs;
    period: Period;
    level: ChartCalendarLevel;
    levelIndex: number;
    time: DataChartTime;
    vido: Vido;
    api: Api;
}) => number;
export interface ChartCalendarLevelFormat {
    zoomTo: number;
    period: Period;
    periodIncrement?: number | CharCalendarLevelFormatFunction;
    main?: boolean;
    classNames?: string[];
    format: (args: ChartCalendarFormatArguments) => string | htmlResult;
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
    rowTop?: number;
    minWidth?: number;
    cutIcons?: CutIcons;
    overlap?: boolean;
}
export interface ChartSpacing {
    left?: number;
    right?: number;
}
export interface Chart {
    time?: ChartTime;
    calendarLevels?: ChartCalendarLevel[];
    grid?: ChartGrid;
    items?: Items;
    item?: DefaultItem;
    spacing?: number | ChartSpacing;
}
export interface ActionFunctionResult {
    update?: (element: HTMLElement, data: unknown) => void;
    destroy?: (element: HTMLElement, data: unknown) => void;
}
export interface ActionData {
    componentName: SlotName;
    [key: string]: any;
}
export declare type Action = (element: HTMLElement, data: ActionData) => ActionFunctionResult | void;
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
export interface TemplateVariables {
    [key: string]: any;
}
export declare type Template = (variables: TemplateVariables) => htmlResult;
export declare type Templates = {
    [name in SlotName]?: Template;
};
export interface LicenseType {
    text: 'Trial' | 'Free' | 'Regular' | 'Ultimate';
    value: 'trial' | 'free' | 'regular' | 'ultimate';
}
export interface ValidUntil {
    text: string;
    value: number;
}
export interface License {
    type: LicenseType;
    registeredDomains: string[];
    validUntil: ValidUntil;
    for: string;
}
export interface AdditionalSpace {
    top: number;
    bottom: number;
}
export interface Config {
    licenseKey: string;
    debug?: boolean | string;
    plugins?: PluginInitialization[];
    plugin?: unknown;
    innerHeight?: number;
    autoInnerHeight?: boolean;
    initialWidth?: number;
    headerHeight?: number;
    additionalSpace?: AdditionalSpace;
    components?: Components;
    slots?: Slots;
    list?: List;
    scroll?: Scroll;
    chart?: Chart;
    actions?: Actions;
    templates?: Templates;
    locale?: Locale;
    utcMode?: boolean;
    merge?: (target: object, source: object) => object;
    useLast?: boolean;
    Promise?: Promise<unknown> | any;
    mute?: string[];
    readonly version?: string;
}
export interface TreeMapNode {
    id: string;
    children: string[];
    allChildren: string[];
    parents: string[];
    parentId: string | undefined;
}
export interface TreeMap {
    [rowId: string]: TreeMapNode;
}
export interface DataList {
    width: number;
    visibleRows: string[];
    visibleRowsHeight: number;
    rowsWithParentsExpanded: string[];
    rowsHeight: number;
    rowsIds: string[];
    rows: RowsData;
}
export interface Dimensions {
    width: number;
    height: number;
}
export interface DataChartDimensions extends Dimensions {
    /**
     * config.innerHeight (whole height - calendar height) minus scroll bar height
     */
    heightWithoutScrollBar: number;
    /**
     * From config.innerHeight
     */
    innerHeight: number;
    widthWithoutScrollBar: number;
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
    visibleItems: string[];
    time: DataChartTime;
}
export interface DataElements {
    [key: string]: HTMLElement;
}
export interface ItemRowMap {
    [itemId: string]: string;
}
export interface Data {
    treeMap: TreeMap;
    itemRowMap: ItemRowMap;
    list: DataList;
    dimensions: Dimensions;
    chart: DataChart;
    scroll: DataScroll;
    elements: DataElements;
}
export interface GSTCState {
    config: Config;
    $data: Data;
    license: License;
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
    lithtml: typeof lithtml;
}
declare function GSTC(options: GSTCOptions): GSTCResult;
declare namespace GSTC {
    var api: {
        name: string;
        GSTCID: (originalId: string) => string;
        isGSTCID: (id: string) => boolean;
        sourceID: (id: string) => string;
        fromArray(array: any): {};
        stateFromConfig: typeof import("./api/public").stateFromConfig;
        wasmStateFromConfig: typeof import("./api/public").wasmStateFromConfig;
        merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        lithtml: typeof import("lit-html");
        html: typeof import("lit-html");
        vido: typeof import("@neuronet.io/vido");
        date(time?: any, utcMode?: boolean, localeConfig?: Locale): Dayjs;
        setPeriod(period: Period): number;
        dayjs: typeof import("dayjs");
    };
    var lithtml: typeof import("lit-html");
}
export default GSTC;
//# sourceMappingURL=gstc.d.ts.map