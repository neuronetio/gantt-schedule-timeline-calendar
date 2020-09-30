declare module "api/time" {
    import dayjs, { Dayjs } from 'dayjs';
    import { DataChartTime, DataChartTimeLevelDate, ChartTimeDate, ScrollTypeHorizontal, Period, ChartCalendarLevel, ChartCalendarLevelFormat } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Api } from "api/api";
    export interface CurrentDate {
        timestamp: number;
        hour: Dayjs;
        day: Dayjs;
        week: Dayjs;
        month: Dayjs;
        year: Dayjs;
    }
    export class Time {
        private locale;
        private utcMode;
        private state;
        private api;
        dayjs: typeof dayjs;
        currentDate: CurrentDate;
        constructor(state: DeepState, api: Api);
        private resetCurrentDate;
        date(time?: number | string | Date | undefined): dayjs.Dayjs;
        private addAdditionalSpace;
        recalculateFromTo(time: DataChartTime): DataChartTime;
        getCenter(time: DataChartTime): number;
        getGlobalOffsetPxFromDates(date: Dayjs, time?: DataChartTime): number;
        getViewOffsetPxFromDates(date: Dayjs, limitToView?: boolean, time?: DataChartTime): number;
        limitOffsetPxToView(x: number, time?: DataChartTime): number;
        findDateAtOffsetPx(offsetPx: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
        findDateAtTime(milliseconds: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
        getTimeFromViewOffsetPx(offsetPx: number, time?: DataChartTime, snapToStartOf?: boolean): number;
        calculateScrollPosPxFromTime(milliseconds: number, time: DataChartTime | undefined, scroll: ScrollTypeHorizontal | undefined): number;
        getCurrentFormatForLevel(level: ChartCalendarLevel, time: DataChartTime): ChartCalendarLevelFormat;
        generatePeriodDates({ leftDate, rightDate, period, level, levelIndex, time, callOnDate, callOnLevelDates, }: {
            leftDate: Dayjs;
            rightDate: Dayjs;
            period: Period;
            level: ChartCalendarLevel;
            levelIndex: number;
            time: DataChartTime;
            callOnDate: boolean;
            callOnLevelDates: boolean;
        }): DataChartTimeLevelDate[];
        getDatesDiffPx(fromTime: Dayjs, toTime: Dayjs, time: DataChartTime, accurate?: boolean): number;
        getLeftViewDate(time?: DataChartTime): ChartTimeDate | null;
        getRightViewDate(time?: DataChartTime): ChartTimeDate | null;
        getLowerPeriod(period: Period): Period;
        getHigherPeriod(period: Period): Period;
    }
}
declare module "api/slots" {
    import { Vido } from "gstc";
    import { Slots as VidoSlots, ComponentInstance, Component } from '@neuronet.io/vido';
    export type SlotInstances = {
        [key: string]: ComponentInstance[];
    };
    export interface SlotStorage {
        [key: string]: Component[];
    }
    export class Slots extends VidoSlots {
        private name;
        private subs;
        constructor(name: string, vido: Vido, props: unknown);
        destroy(): void;
        getName(): string;
    }
    export function generateSlots(name: string, vido: Vido, props: unknown): Slots;
}
declare module "api/api" {
    import { Time } from "api/time";
    import State from 'deep-state-observer';
    import DeepState from 'deep-state-observer';
    import dayjs from 'dayjs';
    import { Config, Period, DataChartTime, ScrollTypeHorizontal, Row, Item, Vido, Items, ScrollTypeVertical, Rows, GridCell, GridRow, DataItems, ItemData, ItemDataUpdate, ColumnData, RowData, RowsData } from "gstc";
    import { generateSlots } from "api/slots";
    import { lithtml } from '@neuronet.io/vido';
    export function getClass(name: string, appendix?: string): string;
    export function getId(name: string, id: string): string;
    export function prepareState(userConfig: Config): {
        config: unknown;
    };
    export function stateFromConfig(userConfig: Config): State;
    export function wasmStateFromConfig(userConfig: Config, wasmFile?: string): Promise<any>;
    export const publicApi: {
        name: string;
        GSTCID(originalId: string): string;
        isGSTCID(id: string): boolean;
        sourceID(id: string): string;
        fromArray(array: any): {};
        stateFromConfig: typeof stateFromConfig;
        wasmStateFromConfig: typeof wasmStateFromConfig;
        merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        lithtml: typeof lithtml;
        html: typeof lithtml;
        date(time: any): dayjs.Dayjs;
        setPeriod(period: Period): number;
        dayjs: typeof dayjs;
    };
    export interface WheelResult {
        x: number;
        y: number;
        z: number;
        event: WheelEvent;
    }
    export interface IconsCache {
        [key: string]: string;
    }
    export type Unsubscribes = (() => void)[];
    export class Api {
        name: string;
        debug: boolean;
        state: DeepState;
        time: Time;
        vido: Vido;
        plugins: any;
        iconsCache: IconsCache;
        unsubscribes: Unsubscribes;
        private mutedMethods;
        constructor(state: DeepState);
        getListenerPosition(callback: any): string | number;
        setVido(Vido: Vido): void;
        log(...args: any[]): void;
        generateSlots: typeof generateSlots;
        mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        getClass: typeof getClass;
        getId: typeof getId;
        GSTCID: any;
        isGSTCID: any;
        sourceID: any;
        allActions: any[];
        getActions(name: string): any;
        isItemInViewport(item: Item, leftGlobal?: number, rightGlobal?: number): boolean;
        private getChildrenLinkedItemsIds;
        collectAllLinkedItems(items: Items, itemsData: DataItems): void;
        getChildrenDependantItemsIds(item: Item, items: Items, allDependant?: string[]): string[];
        getRow(rowId: string): Row;
        getRows(rowsId: string[]): Row[];
        getAllRows(): Rows;
        getVisibleRowsId(): string[];
        getRowsData(): RowsData;
        setRowsData(data: RowsData): void;
        getRowData(rowId: string): RowData;
        setRowData(rowId: string, data: RowData): void;
        getItem(itemId: string): Item;
        getItems(itemsId?: string[]): Item[];
        getAllItems(): Items;
        getItemData(itemId: string): ItemData;
        getItemsData(): DataItems;
        setItemData(itemId: string, data: ItemDataUpdate): void;
        setItemsData(data: DataItems): void;
        prepareDependantItems(item: Item, items: Items): string[];
        prepareItems(items: Items): Items;
        sortRows(rowsArray: Row[]): Rows;
        fillEmptyRowValues(rows: Rows): Rows;
        itemsOnTheSameLevel(item1: Item, item2: Item): boolean;
        itemsOverlaps(item1: Item, item2: Item): boolean;
        itemOverlapsWithOthers(item: Item, items: Item[]): Item;
        fixOverlappedItems(rowItems: Item[]): void;
        recalculateRowHeight(row: Row, rowData: RowData): number;
        recalculateRowsHeights(rowsId: string[]): number;
        recalculateRowsPercents(rowsId: string[], verticalAreaHeight: number): void;
        calculateVisibleRowsHeights(): void;
        generateParents(rows: RowsData | Items, parentName?: string): {};
        fastTree(rowParents: any, node: any, parents?: any[]): any;
        makeTreeMap(rowsData: RowsData, items: Items, onlyItems?: boolean): void;
        getRowsWithParentsExpanded(rows: Rows): any[];
        getVisibleRows(rowsWithParentsExpanded: string[]): string[];
        private getSortableValue;
        sortRowsByColumn(column: ColumnData, asc?: boolean): void;
        normalizeMouseWheelEvent(event: WheelEvent): WheelResult;
        scrollToTime(toTime: number, centered?: boolean, time?: DataChartTime): number;
        setScrollLeft(dataIndex: number | undefined, time?: DataChartTime, multi?: any, recalculateTimesLastReason?: string): any;
        getScrollLeft(): ScrollTypeHorizontal;
        setScrollTop(dataIndex: number | undefined, offset?: number): void;
        getScrollTop(): ScrollTypeVertical;
        getGridCells(cellIds?: string[]): GridCell[];
        getGridRows(rowIds?: string[]): GridRow[];
        getGridCell(cellId: string): GridCell;
        getGridRow(rowId: string): GridRow;
        muteMethod(methodName: string): void;
        unmuteMethod(methodName: string): void;
        isMutedMethod(methodName: string): boolean;
        getSVGIconSrc(svg: any): string;
        destroy(): void;
    }
}
declare module "gstc" {
    import 'pepjs';
    import { vido, lithtml, ComponentInstance } from '@neuronet.io/vido';
    import { Api } from "api/api";
    import { Dayjs, OpUnitType } from 'dayjs';
    import { Properties as CSSProps } from 'csstype';
    import DeepState from 'deep-state-observer';
    export type Vido = vido<DeepState, Api>;
    export interface RowDataPosition {
        top: number;
        topPercent: number;
        bottomPercent: number;
        viewTop: number;
    }
    export interface RowData {
        id: string;
        parentId: string | undefined;
        actualHeight: number;
        outerHeight: number;
        position: RowDataPosition;
        parents: string[];
        children: string[];
        items: string[];
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
        style?: CSSProps;
        classNames?: string[] | classNamesFn;
        [key: string]: any;
    }
    export type classNamesFn = ({ row, vido }: {
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
    export type ItemLabelFunction = ({ item, vido }: {
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
        width: number;
    }
    export interface GridRows {
        [rowId: string]: GridRow;
    }
    export type VoidFunction = () => void;
    export type PluginInitialization = (vido: Vido) => void | VoidFunction;
    export type Plugin = <T>(options: T) => PluginInitialization;
    export type htmlResult = lithtml.TemplateResult | lithtml.TemplateResult[] | lithtml.SVGTemplateResult | lithtml.SVGTemplateResult[] | undefined | null;
    export type RenderFunction = (templateProps: unknown) => htmlResult;
    export type Component = (vido: unknown, props: unknown) => RenderFunction;
    export interface Components {
        [name: string]: Component;
    }
    export type SlotName = 'main' | 'scroll-bar' | 'list' | 'list-column' | 'list-column-header' | 'list-column-header-resizer' | 'list-column-row' | 'list-column-row-expander' | 'list-column-row-expander-toggle' | 'list-toggle' | 'chart' | 'chart-calendar' | 'chart-calendar-date' | 'chart-timeline' | 'chart-timeline-grid' | 'chart-timeline-grid-row' | 'chart-timeline-grid-row-cell' | 'chart-timeline-items' | 'chart-timeline-items-row' | 'chart-timeline-items-row-item';
    export type SlotPlacement = 'outer' | 'inner' | 'container-outer' | 'container-inner' | 'content';
    export type Slot = {
        [placement in SlotPlacement]?: Component[];
    };
    export type Slots = {
        [name in SlotName]?: Slot;
    };
    export interface ColumnResizer {
        width?: number;
        inRealTime?: boolean;
        dots?: number;
    }
    export type ColumnDataFunction = ({ row, vido }: {
        row: Row;
        vido: Vido;
    }) => string | number;
    export type ColumnDataFunctionString = ({ row, vido }: {
        row: Row;
        vido: Vido;
    }) => string;
    export type ColumnDataFunctionTemplate = ({ row, vido }: {
        row: Row;
        vido: Vido;
    }) => htmlResult;
    export type ColumnDataHeaderContent = string | (({ column, vido }: {
        column: ColumnData;
        vido: Vido;
    }) => htmlResult);
    export interface ColumnDataHeader {
        html?: htmlResult;
        content?: ColumnDataHeaderContent;
    }
    export type Sortable = string | ColumnDataFunction;
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
    export type ChartTimeDates = ChartTimeDate[];
    export type ChartTimeOnLevelDatesArg = {
        dates: DataChartTimeLevel;
        time: DataChartTime;
        format: ChartCalendarLevelFormat;
        level: ChartCalendarLevel;
        levelIndex: number;
    };
    export type ChartTimeOnLevelDates = (arg: ChartTimeOnLevelDatesArg) => DataChartTimeLevel;
    export type ChartTimeOnDateArg = {
        date: ChartTimeDate;
        time: DataChartTime;
        format: ChartCalendarLevelFormat;
        level: ChartCalendarLevel;
        levelIndex: number;
    };
    export type ChartTimeOnDate = (arg: ChartTimeOnDateArg) => ChartTimeDate | null;
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
    export type DataChartTimeLevel = DataChartTimeLevelDate[];
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
    export type PeriodString = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
    export type Period = PeriodString | OpUnitType;
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
    export type ChartCalendarLevel = ChartCalendarLevelFormat[];
    export interface GridCellOnCreateArgument extends GridCell {
        vido: Vido;
    }
    export type GridCellOnCreate = (cell: GridCellOnCreateArgument) => string | htmlResult;
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
    export type Action = (element: HTMLElement, data: unknown) => ActionFunctionResult | void;
    export type Actions = {
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
    export interface TreeMap {
        id: string;
        parents: string[];
        children: Row[];
        items: Item[];
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
    function GSTC(options: GSTCOptions): GSTCResult;
    namespace GSTC {
        var api: {
            name: string;
            GSTCID(originalId: string): string;
            isGSTCID(id: string): boolean;
            sourceID(id: string): string;
            fromArray(array: any): {};
            stateFromConfig: typeof import("api/api").stateFromConfig;
            wasmStateFromConfig: typeof import("api/api").wasmStateFromConfig;
            merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
            lithtml: typeof lithtml;
            html: typeof lithtml;
            date(time: any): Dayjs;
            setPeriod(period: OpUnitType): number;
            dayjs: typeof import("dayjs");
        };
    }
    export default GSTC;
}
declare module "components/main" {
    import { Vido } from "gstc";
    export default function Main(vido: Vido, props?: {}): () => any;
}
declare module "components/scroll-bar" {
    import { Vido } from "gstc";
    export interface Props {
        type: 'horizontal' | 'vertical';
    }
    export default function ScrollBar(vido: Vido, props: Props): () => any;
}
declare module "components/list/list" {
    import { Vido } from "gstc";
    export default function List(vido: Vido, props?: {}): () => any;
}
declare module "components/list/column/column" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumn(vido: Vido, props: Props): () => any;
}
declare module "components/list/column/column-header" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumnHeader(vido: Vido, props: Props): () => any;
}
declare module "components/list/column/column-header-resizer" {
    import { Vido, ColumnData } from "gstc";
    export interface Props {
        column: ColumnData;
    }
    export default function ListColumnHeaderResizer(vido: Vido, props: Props): () => any;
}
declare module "components/list/column/column-row" {
    import { ColumnData, Row, RowData, Vido } from "gstc";
    export interface Props {
        row: Row;
        rowData: RowData;
        column: ColumnData;
    }
    export default function ListColumnRow(vido: Vido, props: Props): () => any;
}
declare module "components/list/column/column-row-expander" {
    import { Row, RowData, Vido } from "gstc";
    export interface Props {
        row: Row;
        rowData: RowData;
    }
    export default function ListColumnRowExpander(vido: Vido, props: Props): () => any;
}
declare module "components/list/column/column-row-expander-toggle" {
    import { Row, RowData, Vido } from "gstc";
    export interface Props {
        row: Row;
        rowData: RowData;
    }
    export default function ListColumnRowExpanderToggle(vido: Vido, props: Props): () => any;
}
declare module "components/list/list-toggle" {
    import { Vido } from "gstc";
    export default function ListToggle(vido: Vido, props?: {}): () => any;
}
declare module "components/chart/chart" {
    import { Vido } from "gstc";
    export default function Chart(vido: Vido, props?: {}): () => any;
}
declare module "components/chart/calendar/calendar" {
    import { Vido } from "gstc";
    export default function ChartCalendar(vido: Vido, props: any): () => any;
}
declare module "components/chart/calendar/calendar-date" {
    import { ChartTimeDate, Period, Vido } from "gstc";
    export interface Props {
        level: number;
        date: ChartTimeDate;
        period: Period;
    }
    export default function ChartCalendarDay(vido: Vido, props: Props): () => any;
}
declare module "components/chart/timeline/timeline" {
    import { Vido } from "gstc";
    export default function ChartTimeline(vido: Vido, props: any): () => any;
}
declare module "components/chart/timeline/grid/grid" {
    import { Vido } from "gstc";
    export default function ChartTimelineGrid(vido: Vido, props: any): () => any;
}
declare module "components/chart/timeline/grid/grid-row" {
    import { GridRow, Vido } from "gstc";
    export default function ChartTimelineGridRow(vido: Vido, props: GridRow): () => any;
}
declare module "components/chart/timeline/grid/grid-row-cell" {
    import { Row, ChartTimeDate, Vido, htmlResult } from "gstc";
    interface Props {
        id: string;
        row: Row;
        time: ChartTimeDate;
        content: string | htmlResult;
    }
    function ChartTimelineGridRowCell(vido: Vido, props: Props): () => any;
    export default ChartTimelineGridRowCell;
}
declare module "components/chart/timeline/items/items" {
    import { Vido } from "gstc";
    export default function ChartTimelineItems(vido: Vido, props?: {}): () => any;
}
declare module "components/chart/timeline/items/items-row" {
    import { Row, Vido, RowData } from "gstc";
    export interface Props {
        row: Row;
        rowData: RowData;
    }
    export default function ChartTimelineItemsRow(vido: Vido, props: Props): () => any;
}
declare module "components/chart/timeline/items/items-row-item" {
    import { Row, Item, Vido } from "gstc";
    export interface Props {
        row: Row;
        item: Item;
    }
    export default function ChartTimelineItemsRowItem(vido: Vido, props: Props): () => any;
}
declare module "default-config" {
    import { Config, SlotName } from "gstc";
    export const actionNames: SlotName[];
    function defaultConfig(): Config;
    export default defaultConfig;
}
declare module "plugins/calendar-scroll" {
    export interface Point {
        x: number;
        y: number;
    }
    export interface Options {
        enabled: boolean;
        bodyClassName: string;
    }
    export function Plugin(options?: Options): (vidoInstance: any) => () => void;
}
declare module "plugins/dependency-lines" {
    import { Vido } from "gstc";
    export interface Options {
        type?: 'straight';
        propertyName?: string;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/highlight-weekends" {
    import { Vido } from "gstc";
    export interface Options {
        weekdays?: number[];
        className?: string;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/timeline-pointer" {
    import { Vido } from "gstc";
    export const CELL = "chart-timeline-grid-row-cell";
    export type CELL_TYPE = 'chart-timeline-grid-row-cell';
    export const ITEM = "chart-timeline-items-row-item";
    export type ITEM_TYPE = 'chart-timeline-items-row-item';
    export type SELECTION_TYPE = typeof CELL | typeof ITEM;
    export interface PointerEvents {
        down: PointerEvent | null;
        move: PointerEvent | null;
        up: PointerEvent | null;
    }
    export interface Point {
        x: number;
        y: number;
    }
    export type PointerState = 'up' | 'down' | 'move';
    export interface CaptureEvents {
        up?: boolean;
        down?: boolean;
        move?: boolean;
    }
    export interface Options {
        enabled?: boolean;
        captureEvents?: CaptureEvents;
    }
    export interface Offset {
        top: number;
        left: number;
    }
    export interface Movement {
        x: number;
        y: number;
    }
    export interface PluginData extends Options {
        isMoving: boolean;
        pointerState: PointerState;
        currentTarget: HTMLElement | null;
        realTarget: HTMLElement | null;
        targetType: ITEM_TYPE | CELL_TYPE | '';
        targetData: any | null;
        events: PointerEvents;
        initialPosition: Point;
        currentPosition: Point;
        movement: Movement;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/item-movement" {
    import { Vido, Item, DataChartTime, DataItems } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Dayjs } from 'dayjs';
    export interface SnapArg {
        item: Item;
        time: DataChartTime;
        vido: Vido;
        movement: Movement;
    }
    export interface SnapStartArg extends SnapArg {
        startTime: Dayjs;
    }
    export interface SnapEndArg extends SnapArg {
        endTime: Dayjs;
    }
    export interface Movement {
        x: number;
        y: number;
        time: number;
    }
    export interface SnapToTime {
        start?: (snapStartArgs: SnapStartArg) => Dayjs;
    }
    export interface BeforeAfterInitialItems {
        initial: Item[];
        before: Item[];
        after: Item[];
        targetData: Item | null;
    }
    export interface OnArg {
        items: BeforeAfterInitialItems;
        vido: Vido;
        state: DeepState;
        time: DataChartTime;
    }
    export interface Events {
        onStart?: (onArg: OnArg) => Item[];
        onMove?: (onArg: OnArg) => Item[];
        onEnd?: (onArg: OnArg) => Item[];
    }
    export interface Threshold {
        horizontal?: number;
        vertical?: number;
    }
    export interface ScrollSpeed {
        horizontal?: number;
        vertical?: number;
    }
    export interface AutoScroll {
        speed?: ScrollSpeed;
        edgeThreshold?: Threshold;
    }
    export interface Options {
        enabled?: boolean;
        dependant?: boolean;
        debug?: boolean;
        bodyClass?: string;
        itemClass?: string;
        events?: Events;
        snapToTime?: SnapToTime;
        threshold?: Threshold;
        autoScroll?: AutoScroll;
    }
    export type State = 'start' | 'move' | 'end' | '';
    export interface PluginData extends Options {
        isMoving: boolean;
        initialItems: Item[];
        initialDependant: Item[];
        initialItemsData: DataItems;
        initialDependantData: DataItems;
        state: State;
        movement: Movement;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/item-resizing" {
    import { Vido, htmlResult, Item, DataChartTime, DataItems } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Point } from "plugins/timeline-pointer";
    import { Dayjs } from 'dayjs';
    export interface Handle {
        width?: number;
        outsideWidth?: number;
        horizontalMargin?: number;
        outsideHorizontalMargin?: number;
        verticalMargin?: number;
        outside?: boolean;
        onlyWhenSelected?: boolean;
    }
    export interface SnapArg {
        item: Item;
        time: DataChartTime;
        vido: Vido;
        movement: Movement;
    }
    export interface SnapStartArg extends SnapArg {
        startTime: Dayjs;
    }
    export interface SnapEndArg extends SnapArg {
        endTime: Dayjs;
    }
    export interface Movement {
        px: number;
        time: number;
    }
    export interface SnapToTime {
        start?: (snapStartArgs: SnapStartArg) => Dayjs;
        end?: (snapEndArgs: SnapEndArg) => Dayjs;
    }
    export interface BeforeAfterInitialItems {
        initial: Item[];
        before: Item[];
        after: Item[];
        targetData: Item | null;
    }
    export interface OnArg {
        items: BeforeAfterInitialItems;
        vido: Vido;
        state: DeepState;
        time: DataChartTime;
    }
    export interface Events {
        onStart?: (onArg: OnArg) => Item[];
        onResize?: (onArg: OnArg) => Item[];
        onEnd?: (onArg: OnArg) => Item[];
    }
    export interface Options {
        enabled?: boolean;
        dependant?: boolean;
        debug?: boolean;
        handle?: Handle;
        content?: htmlResult;
        bodyClass?: string;
        bodyClassLeft?: string;
        bodyClassRight?: string;
        events?: Events;
        snapToTime?: SnapToTime;
        outsideWidthThreshold?: number;
    }
    export type State = 'start' | 'resize' | 'end' | '';
    export interface PluginData extends Options {
        leftIsMoving: boolean;
        rightIsMoving: boolean;
        initialItems: Item[];
        initialDependant: Item[];
        initialItemsData: DataItems;
        initialDependantData: DataItems;
        initialPosition: Point;
        currentPosition: Point;
        targetData: Item | null;
        state: State;
        movement: Movement;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/progress-bar" {
    import { Vido } from "gstc";
    export const pluginPath = "config.plugin.ProgressBar";
    export interface Options {
        enabled?: boolean;
        className?: string;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/selection" {
    import { ITEM, ITEM_TYPE, CELL, CELL_TYPE, Point, PointerState } from "plugins/timeline-pointer";
    import { Item, GridCell, Vido } from "gstc";
    export type ModKey = 'shift' | 'ctrl' | 'alt' | '';
    export interface SelectionItems {
        [key: string]: Item[];
    }
    export interface SelectState {
        selecting?: SelectionItems;
        selected?: SelectionItems;
    }
    export interface Events {
        onStart?: (lastSelected: EventSelection) => void;
        onSelecting?: (selecting: EventSelection, last: EventSelection) => EventSelection;
        onEnd?: (selected: EventSelection, last: EventSelection) => EventSelection;
    }
    export interface Options {
        enabled?: boolean;
        cells?: boolean;
        items?: boolean;
        showOverlay?: boolean;
        rectangularSelection?: boolean;
        multipleSelection?: boolean;
        selectKey?: ModKey;
        multiKey?: ModKey;
        selectedClassName?: string;
        selectingClassName?: string;
        bodySelectedClassName?: string;
        bodySelectingClassName?: string;
        events?: Events;
        pointerEvents?: PointerEvents;
        onStart?: (lastSelected: EventSelection) => void;
        onSelecting?: (selecting: EventSelection, last: EventSelection) => EventSelection;
        onSelected?: (selected: EventSelection, last: EventSelection) => EventSelection;
    }
    export interface Area {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    export interface Selection {
        [CELL]: string[];
        [ITEM]: string[];
    }
    export type GridCellOrId = GridCell | string;
    export type ItemOrId = Item | string;
    export interface EventSelection {
        [CELL]: GridCellOrId[];
        [ITEM]: ItemOrId[];
    }
    export interface SelectedCell {
        rowId: string;
        cellId: string;
    }
    export interface PointerEvents {
        down: PointerEvent | null;
        move: PointerEvent | null;
        up: PointerEvent | null;
    }
    export interface PluginData extends Options {
        enabled: boolean;
        isSelecting: boolean;
        showOverlay: boolean;
        pointerState: PointerState;
        initialPosition: Point;
        currentPosition: Point;
        selectionAreaLocal: Area;
        selectionAreaGlobal: Area;
        selected: Selection;
        lastSelected: Selection;
        selecting: Selection;
        automaticallySelected: Selection;
        pointerEvents: PointerEvents;
        events: Events;
        targetType: ITEM_TYPE | CELL_TYPE | '';
        targetData: any;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/time-bookmarks" {
    import { Vido } from "gstc";
    import { Color } from 'csstype';
    export const pluginPath = "config.plugin.TimeBookmarks";
    export const slotPath = "config.slots.chart.content";
    export interface Bookmark {
        time: string | number;
        label: string;
        className?: string;
        color?: Color;
    }
    export interface InternalBookmark extends Bookmark {
        id: string;
        leftViewPx: number;
    }
    export interface Bookmarks {
        [key: string]: Bookmark;
    }
    export interface Options {
        enabled?: boolean;
        className?: string;
        bookmarks?: Bookmarks;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
//# sourceMappingURL=global.d.ts.map