declare module "api/time" {
    import dayjs, { Dayjs } from 'dayjs';
    import { DataChartTime, DataChartTimeLevelDate, ChartTimeDate, Period, ChartCalendarLevel, ChartCalendarLevelFormat } from "gstc";
    import DeepState from 'deep-state-observer';
    import { Api } from "api/api";
    export interface CurrentDate {
        timestamp: number;
        second: Dayjs;
        minute: Dayjs;
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
declare module "api/id" {
    class IDApi {
        constructor();
        GSTCID(originalId: string): string;
        isGSTCID(id: string): boolean;
        sourceID(id: string): string;
    }
    const _default: IDApi;
    export default _default;
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
    import DeepState from 'deep-state-observer';
    import { DataChartTime, Row, Item, Vido, Items, Rows, GridCell, GridRows, GridRow, GridCells, DataItems, ItemData, ItemDataUpdate, ColumnData, RowData, RowsData, ItemDataPosition, DataChartTimeLevels, DataScrollVertical, DataScrollHorizontal, ChartTimeDates } from "gstc";
    import { generateSlots } from "api/slots";
    export const mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
    export function getClass(name: string, appendix?: string): string;
    export function getId(name: string, id: string): string;
    export interface WheelResult {
        x: number;
        y: number;
        z: number;
        event: WheelEvent;
    }
    export interface IconsCache {
        [key: string]: string;
    }
    export interface RowsHeightMapNode {
        id: string;
        dataIndex: number;
        keys: number[];
        [height: number]: RowsHeightMapNode;
    }
    export type Unsubscribes = (() => void)[];
    export interface Cache {
        rowsWithParentsExpanded: Row[];
        rowsDataWithParentsExpanded: RowData[];
        rowsIdsWithParentsExpanded: string[];
        rowsWithParentsExpandedAsMap: Map<string, Row>;
        rowsHeightMap: RowsHeightMapNode;
        rowsWithParentsExpandedDataIndexMap: Map<string, number>;
        itemsAsArray: Item[];
        itemsDataAsArray: ItemData[];
    }
    export class Api {
        apiId: number;
        name: string;
        debug: string | boolean;
        state: DeepState;
        time: Time;
        vido: Vido;
        plugins: any;
        pluginsPositions: Set<string>;
        iconsCache: IconsCache;
        unsubscribes: Unsubscribes;
        private mutedMethods;
        generateSlots: typeof generateSlots;
        mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        getClass: typeof getClass;
        getId: typeof getId;
        GSTCID: (originalId: string) => string;
        isGSTCID: (id: string) => boolean;
        sourceID: (id: string) => string;
        allActions: any[];
        main: any;
        constructor(state: DeepState);
        render(): Promise<unknown>;
        getListenerPosition(callback: any): string | number;
        setVido(Vido: Vido): void;
        log(...args: any[]): void;
        pluginInitialized(pluginName: string): void;
        pluginDestroyed(pluginName: string): void;
        clearPluginsPositions(): void;
        isPluginInitialized(pluginName: string): boolean;
        getPluginPosition(pluginName?: string): number;
        getPluginsPositions(): {};
        isPluginInitializedBefore(pluginName: string, beforePluginName: string): boolean;
        getActions(name: string): any;
        isItemInViewport(item: Item, leftGlobal?: number, rightGlobal?: number): boolean;
        private getChildrenLinkedItemsIds;
        collectAllLinkedItems(items: Items, itemsData: DataItems): void;
        getChildrenDependantItemsIds(item: Item, items: Items, allDependant?: string[]): string[];
        calculateItemVerticalPosition(itemId: string, itemData?: ItemData, rowData?: RowData, item?: Item): ItemDataPosition;
        calculateItemHorizontalPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, spacing?: number, item?: Item): ItemDataPosition;
        calculateItemPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, spacing?: number, item?: Item): ItemDataPosition;
        getItemPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, spacing?: number, item?: Item): ItemDataPosition;
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
        getAllItemsAsArray(): Item[];
        getAllItemsDataAsArray(): ItemData[];
        getAllItems(): Items;
        getItemData(itemId: string): ItemData;
        getItemsData(): DataItems;
        setItemData(itemId: string, data: ItemDataUpdate): void;
        setItemsData(data: DataItems): void;
        prepareDependantItems(item: Item, items: Items): string[];
        prepareItem(item: Item, defaultItemHeight?: number, itemsData?: DataItems, items?: Items): void;
        prepareItems(items: Items): Items;
        sortRowsByChildren(rowsIds: string[], sortedRows?: {}, rows?: Rows, rowsData?: RowsData): Rows;
        private getSortableValue;
        sortRowsByColumn(column: ColumnData, asc?: boolean): Rows;
        fillEmptyRowValues(rows: Rows): Rows;
        itemsOnTheSameLevel(item1: Item, item2: Item): boolean;
        itemsOverlaps(item1: Item, item2: Item): boolean;
        itemOverlapsWithOthers(item: Item, items: Item[]): Item;
        fixOverlappedItems(rowItems: Item[]): void;
        private makeChildren;
        private keysToKeep;
        private clearNested;
        private fastTree;
        makeTreeMap(rowsData: RowsData, items: Items, onlyItems?: boolean): RowsData;
        private _updateRowsWithParentsExpandedCache;
        generateRowsWithParentsExpanded(rows: Rows): any[];
        getRowInfoFromHeight(wantedAbsolutePosition: number): {
            dataIndex: number;
            row: Row;
            rowData: RowData;
        };
        getRowViewTop(rowId: string, rowsData?: RowsData, scrollVertical?: DataScrollVertical): number;
        parentsExpanded(rowId: string): boolean;
        recalculateRowHeight(row: Row, rowData: RowData): number;
        calculateVisibleRowsHeights(): void;
        getRealChartHeight(withScrollBar?: boolean): any;
        getLastRowId(rowsWithParentsExpanded?: string[], verticalScroll?: DataScrollVertical): string;
        getLastRowIndex(rowsWithParentsExpanded?: string[], verticalScroll?: DataScrollVertical): number;
        private generateRowsHeightMap;
        getRowHeightMapNode(topPosition: number, node?: RowsHeightMapNode): RowsHeightMapNode;
        measureRows(): number | any[];
        getVisibleRows(): string[];
        normalizeMouseWheelEvent(event: WheelEvent): WheelResult;
        scrollToTime(toTime: number, centered?: boolean): number;
        setScrollLeft(dataIndex: number | undefined, offset?: number): number;
        getScrollLeft(): DataScrollHorizontal;
        getScrollSize(type: 'horizontal' | 'vertical'): number;
        getLastPageDatesWidth(chartWidth: number, allDates: ChartTimeDates): {
            lastPageSize: number;
            lastPageCount: number;
        };
        calculateInitialChartWidth(withoutScrollBar?: boolean): number;
        getChartWidth(withoutScrollBar?: boolean): any;
        calculateHorizontalScrollSize(): void;
        getLastPageRowsHeight(innerHeight: number, rowsWithParentsExpanded: string[]): {
            lastPageSize: number;
            lastPageCount: number;
        };
        calculateVerticalScrollSize(): void;
        setScrollTop(dataIndexOrRowId?: string | number, offset?: number): number;
        getScrollTop(): DataScrollVertical;
        getCurrentCalendarLevels(): DataChartTimeLevels;
        getGridCells(cellIds?: string[]): GridCell[];
        getAllGridCells(): GridCells;
        getGridRows(rowIds?: string[]): GridRow[];
        getAllGridRows(): GridRows;
        getGridCell(cellId: string): GridCell;
        getGridRow(rowId: string): GridRow;
        muteMethod(methodName: string): void;
        unmuteMethod(methodName: string): void;
        isMutedMethod(methodName: string): boolean;
        getSVGIconSrc(svg: any): string;
        destroy(): void;
    }
}
declare module "api/public" {
    import DeepState from 'deep-state-observer';
    import dayjs from 'dayjs';
    import { Config, Period } from "gstc";
    import { lithtml } from '@neuronet.io/vido';
    export const mergeDeep: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
    export function prepareState(userConfig: Config): {
        config: unknown;
    };
    export function stateFromConfig(userConfig: Config): DeepState;
    export function wasmStateFromConfig(userConfig: Config, wasmFile?: string): Promise<any>;
    export const publicApi: {
        name: string;
        GSTCID: (originalId: string) => string;
        isGSTCID: (id: string) => boolean;
        sourceID: (id: string) => string;
        fromArray(array: any): {};
        stateFromConfig: typeof stateFromConfig;
        wasmStateFromConfig: typeof wasmStateFromConfig;
        merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
        lithtml: typeof lithtml;
        html: typeof lithtml;
        date(time?: any): dayjs.Dayjs;
        setPeriod(period: Period): number;
        dayjs: typeof dayjs;
    };
}
declare module "api/main" {
    import { Dayjs } from 'dayjs';
    import { DataChartTime, DataChartTimeLevel, DataChartTimeLevelDate, ChartCalendarLevel, ChartTimeDate, ChartTimeDates, ChartCalendarLevelFormat, Vido, Reason } from "gstc";
    export default function main(vido: Vido): {
        className: string;
        styleMap: import("@neuronet.io/vido").StyleMap;
        initializePlugins(): void;
        heightChange(): void;
        resizerActiveChange(active: boolean): void;
        generateTreeFromVisibleRows(): void;
        generateTree(fullReload?: boolean): void;
        prepareExpanded(): void;
        generateVisibleRowsAndItems(): void;
        updateItemsVerticalPositions(): void;
        getMutedListeners(): any[];
        triggerLoadedEvent(): void;
        getLastPageDatesWidth(chartWidth: number, allDates: DataChartTimeLevelDate[]): number;
        generatePeriodDates(formatting: ChartCalendarLevelFormat, time: DataChartTime, level: ChartCalendarLevel, levelIndex: number): DataChartTimeLevel;
        limitGlobal(time: DataChartTime, oldTime: DataChartTime): DataChartTime;
        setCenter(time: DataChartTime): void;
        guessPeriod(time: DataChartTime, levels: ChartCalendarLevel[]): DataChartTime;
        getFormatAndLevelIndexForZoom(zoom: number, levels?: ChartCalendarLevel[]): {
            levelIndex: number;
            format: ChartCalendarLevelFormat;
        };
        generateAllDates(time: DataChartTime, levels: ChartCalendarLevel[]): ChartTimeDates[] | 0;
        getPeriodDates(allLevelDates: ChartTimeDates, time: DataChartTime): ChartTimeDate[];
        updateLevels(time: DataChartTime, levels: ChartCalendarLevel[]): void;
        calculateTotalViewDuration(time: DataChartTime): void;
        calculateRightGlobal(leftGlobalDate: Dayjs, chartWidth: number, allMainDates: DataChartTimeLevelDate[], offsetPx: any, offsetMs: any): number;
        updateVisibleItems(time?: DataChartTime, multi?: any): any;
        recalculateTimes(reason: Reason): void;
        minimalReload(eventInfo: any): void;
        partialReload(fullReload: boolean, eventInfo: any): void;
        fullReload(eventInfo: any): void;
    };
}
declare module "components/main" {
    import { Vido } from "gstc";
    export default function Main(vido: Vido, props?: {}): () => any;
}
declare module "gstc" {
    import { vido, lithtml } from '@neuronet.io/vido';
    import { StyleInfo, ComponentInstance } from '@neuronet.io/vido';
    import { Api } from "api/api";
    import { Dayjs, OpUnitType } from 'dayjs';
    import DeepState from 'deep-state-observer/index.esm';
    export type Vido = vido<DeepState, Api>;
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
        rowTop: number;
        top: number;
        actualRowTop: number;
        viewTop: number;
    }
    export interface ItemData {
        id: string;
        time: ItemDataTime;
        actualHeight: number;
        outerHeight: number;
        position: ItemDataPosition;
        width: number;
        actualWidth: number;
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
    export type VoidFunction = () => void;
    export type PluginInitialization = (vido: Vido) => void | VoidFunction;
    export type Plugin = <T>(options: T) => PluginInitialization;
    export type htmlResult = lithtml.TemplateResult | lithtml.TemplateResult[] | lithtml.SVGTemplateResult | lithtml.SVGTemplateResult[] | string | Element | undefined | null;
    export type RenderFunction = (templateProps: unknown) => htmlResult;
    export type Component = (vido: unknown, props: unknown) => RenderFunction;
    export interface Components {
        [name: string]: Component;
    }
    export type SlotName = 'main' | 'scroll-bar' | 'list' | 'list-column' | 'list-column-headers' | 'list-column-header' | 'list-column-header-resizer' | 'list-column-rows' | 'list-column-row' | 'list-column-row-expander' | 'list-column-row-expander-toggle' | 'list-toggle' | 'chart' | 'chart-calendar' | 'chart-calendar-date' | 'chart-timeline' | 'chart-timeline-grid' | 'chart-timeline-grid-row' | 'chart-timeline-grid-row-cell' | 'chart-timeline-items' | 'chart-timeline-items-row' | 'chart-timeline-items-row-item';
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
    }
    export type DataChartTimeLevel = DataChartTimeLevelDate[];
    export type DataChartTimeLevels = DataChartTimeLevel[];
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
        zoom: number;
        format: ChartCalendarLevelFormat;
        level: number;
        levels: DataChartTimeLevels;
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
    export type CharCalendarLevelFormatFunction = ({ currentDates, date, leftDate, rightDate, period, level, levelIndex, time, vido, api, }: {
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
        periodIncrement: number | CharCalendarLevelFormatFunction;
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
        rowTop?: number;
        minWidth?: number;
        cutIcons?: CutIcons;
        overlap?: boolean;
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
    export interface ActionData {
        componentName: SlotName;
        [key: string]: any;
    }
    export type Action = (element: HTMLElement, data: ActionData) => ActionFunctionResult | void;
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
    export interface TemplateVariables {
        [key: string]: any;
    }
    export type Template = (variables: TemplateVariables) => htmlResult;
    export type Templates = {
        [name in SlotName]?: Template;
    };
    export interface Config {
        licenseKey: string;
        debug?: boolean | string;
        plugins?: PluginInitialization[];
        plugin?: unknown;
        innerHeight?: number;
        autoInnerHeight?: boolean;
        initialWidth?: number;
        headerHeight?: number;
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
        innerWidth: number;
        heightWithoutScrollBar: number;
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
            GSTCID: (originalId: string) => string;
            isGSTCID: (id: string) => boolean;
            sourceID: (id: string) => string;
            fromArray(array: any): {};
            stateFromConfig: typeof import("api/public").stateFromConfig;
            wasmStateFromConfig: typeof import("api/public").wasmStateFromConfig;
            merge: typeof import("@neuronet.io/vido/types/helpers").mergeDeep;
            lithtml: typeof lithtml;
            html: typeof lithtml;
            date(time?: any): Dayjs;
            setPeriod(period: Period): number;
            dayjs: typeof import("dayjs");
        };
    }
    export default GSTC;
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
    import { Row, Item, Vido, ItemData } from "gstc";
    export interface Props {
        row: Row;
        item: Item;
        itemData: ItemData;
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
    import { htmlResult, Item, ItemData, RowData, Vido } from "gstc";
    export type LineType = 'straight' | 'square' | 'square-alt' | 'smooth';
    export interface DefaultPoint {
        content: htmlResult;
        width: number;
        height: number;
    }
    export interface Options {
        type?: LineType;
        onLines?: ((lines: Line[]) => Line[])[];
        onLine?: ((line: Line) => Line)[];
        leftPoint?: DefaultPoint;
        rightPoint?: DefaultPoint;
    }
    export interface PluginData extends Options {
        lines: Line[];
    }
    export interface Point {
        x: number;
        y: number;
        type: 'M' | 'L' | 'Q' | 'T' | 'C' | 'S' | '';
        content?: htmlResult;
    }
    export interface Line {
        x: number;
        y: number;
        width: number;
        height: number;
        topOffset: number;
        leftOffset: number;
        type: LineType;
        fromItemData: ItemData;
        toItemData: ItemData;
        fromItem: Item;
        toItem: Item;
        fromRowData: RowData;
        toRowData: RowData;
        points: Point[];
        className: string;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/export-image" {
    import type { Vido } from "gstc";
    export const pluginName = "ExportImage";
    export const pluginPath: string;
    export interface Options {
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/export-pdf" {
    import type { Vido } from "gstc";
    export const pluginName = "ExportPDF";
    export const pluginPath: string;
    export interface Options {
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/grab-scroll" {
    import { Vido } from "gstc";
    export const pluginPath = "config.plugin.ItemTypes";
    export const templatePath = "config.templates.chart-timeline-items-row-item";
    export interface Options {
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
    export interface Locked {
        up: boolean | string;
        down: boolean | string;
        move: boolean | string;
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
    export interface AutoScroll {
        speed?: number;
        edgeThreshold?: number;
    }
    export interface HandleContentObject {
        left: htmlResult;
        right: htmlResult;
    }
    export type HandleContentFunction = ({ item: Item, vido: Vido }: {
        item: any;
        vido: any;
    }) => HandleContentObject;
    export type HandleContent = HandleContentObject | HandleContentFunction | htmlResult;
    export interface Options {
        enabled?: boolean;
        dependant?: boolean;
        debug?: boolean;
        handle?: Handle;
        content?: HandleContent;
        bodyClass?: string;
        bodyClassLeft?: string;
        bodyClassRight?: string;
        events?: Events;
        snapToTime?: SnapToTime;
        outsideWidthThreshold?: number;
        autoScroll?: AutoScroll;
    }
    export type State = 'start' | 'resize' | 'end' | '';
    export interface PluginData extends Options {
        leftIsMoving: boolean;
        rightIsMoving: boolean;
        initialItems: Item[];
        initialDependant: Item[];
        initialItemsData: DataItems;
        initialDependantData: DataItems;
        initialLeftPx: number;
        state: State;
        movement: Movement;
    }
    export function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
}
declare module "plugins/item-types" {
    import { Template, Vido } from "gstc";
    export const pluginPath = "config.plugin.ItemTypes";
    export const templatePath = "config.templates.chart-timeline-items-row-item";
    export interface Options {
        [key: string]: Template;
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
    import { Dayjs } from 'dayjs';
    import { StyleInfo, StyleMap } from '@neuronet.io/vido';
    export const pluginPath = "config.plugin.TimeBookmarks";
    export const slotPath = "config.slots.chart-timeline-items.outer";
    export interface Bookmark {
        time: string | number;
        label: string;
        className?: string;
        color?: Color;
        style?: StyleInfo;
    }
    export interface InternalBookmark extends Bookmark {
        id: string;
        leftViewPx: number;
        absoluteLeftPx: number;
        visible: boolean;
        date: Dayjs;
        styleMap: StyleMap;
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