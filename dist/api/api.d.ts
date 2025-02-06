/**
 * Api functions
 *
 * @header  --gstc--header--
 */
import { Time } from './time';
import type DeepState from 'deep-state-observer';
import type { DataChartTime, Row, Item, Vido, Items, Rows, GridCell, GridRows, GridRow, GridCells, DataItems, ItemData, ItemDataUpdate, ColumnData, RowData, RowsData, ItemDataPosition, DataChartTimeLevels, DataScrollVertical, DataScrollHorizontal, ItemRowMap, ChartTimeDates } from '../gstc';
import { generateSlots } from './slots';
import { getClass, getId } from './helpers';
export interface WheelResult {
    x: number;
    y: number;
    z: number;
    event: WheelEvent;
}
export interface IconsCache {
    [key: string]: string;
}
export interface rowsPositionsMapNode {
    id: string;
    dataIndex: number;
    keys: number[];
    [height: number]: rowsPositionsMapNode;
}
export type Unsubscribes = (() => void)[];
export interface Cache {
    rowsWithParentsExpanded: Row[];
    rowsDataWithParentsExpanded: RowData[];
    rowsIdsWithParentsExpanded: string[];
    allRowsIds: string[];
    allRowsAsArray: Row[];
    rowsWithParentsExpandedAsMap: Map<string, Row>;
    rowsPositionsMap: rowsPositionsMapNode;
    rowsWithParentsExpandedDataIndexMap: Map<string, number>;
    itemsAsArray: Item[];
    itemsDataAsArray: ItemData[];
}
export declare class Api {
    apiId: number;
    name: string;
    debug: string | boolean;
    state: DeepState;
    time: Time;
    vido: Vido;
    plugins: any;
    iconsCache: IconsCache;
    unsubscribes: Unsubscribes;
    private mutedMethods;
    mergeDeep: any;
    generateSlots: typeof generateSlots;
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
    clone(object: object): any;
    setMergeDeep(mergeDeep: any): void;
    log(...args: any[]): void;
    getInitializedPlugins(): Set<string>;
    pluginInitialized(pluginName: string): void;
    pluginDestroyed(pluginName: string): void;
    clearPluginsPositions(): void;
    isPluginInitialized(pluginName: string): boolean;
    getPluginPosition(pluginName?: string): number;
    getPluginsPositions(): {};
    isPluginInitializedBefore(pluginName: string, beforePluginName: string): boolean;
    getActions(name: string): any;
    isItemHorizontallyInViewport(item: Item, leftGlobal?: number, rightGlobal?: number): boolean;
    private getChildrenLinkedItemsIds;
    collectAllLinkedItems(items: Items, itemsData: DataItems): void;
    getChildrenDependantItemsIds(item: Item, items: Items, allDependant?: string[]): string[];
    calculateItemVerticalPosition(itemId: string, itemData?: ItemData, rowData?: RowData, item?: Item): ItemDataPosition;
    setItemDataOutOfView(itemData: ItemData, time?: DataChartTime): ItemData;
    calculateItemHorizontalPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, item?: Item): ItemDataPosition;
    calculateItemPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, item?: Item): ItemDataPosition;
    getItemPosition(itemId: string, itemData?: ItemData, rowData?: RowData, time?: DataChartTime, item?: Item): ItemDataPosition;
    getRow(rowId: string): Row;
    getRows(rowsId: string[]): Row[];
    getAllRows(): Rows;
    getVisibleRowsId(): string[];
    getRowsData(): RowsData;
    setRowsData(data: RowsData): void;
    getRowData(rowId: string): any;
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
    prepareItem(item: Item, defaultItemHeight?: number, itemsData?: DataItems, items?: Items, rows?: Rows): void;
    prepareItems(items: Items): Items;
    sortRowsByChildren(rowsIds: string[], sortedRows?: {}, rows?: Rows, rowsData?: RowsData): Rows;
    private getSortableValue;
    sortRowsByColumn(column: ColumnData, asc?: boolean): Rows;
    fillEmptyRowValues(rows: Rows): Rows;
    itemsOnTheSameLevel(item1Data: ItemData, item2Data: ItemData): boolean;
    itemsTimeOverlaps(item1: Item, item2: Item): boolean;
    itemsOverlaps(item1: Item, item2: Item, item1Data: ItemData, item2Data: ItemData): boolean;
    itemOverlapsWithOthers(item: Item, rowItems: Item[], fromIndex?: number): Item;
    private makeChildren;
    private keysToKeep;
    private clearNested;
    private fastTree;
    updateRowItemsAndItemRowMapForItem(itemId: string, newRowId: string, itemRowMap?: ItemRowMap, rowsData?: RowsData, items?: Items): void;
    sortRowItemsInAddOrder(itemIndexes: {
        [id: string]: number;
    }, rowData: RowData): void;
    sortRowItemsByTime(rowData: RowData): void;
    makeTreeMap(rowsData: RowsData, items: Items, onlyItems?: boolean): RowsData;
    private _updateRowsWithParentsExpandedCache;
    generateRowsWithParentsExpanded(rows: Rows): any[];
    getRowInfoFromTop(wantedAbsolutePosition: number): {
        dataIndex: number;
        row: Row;
        rowData: RowData;
    };
    getRowViewTop(rowId: string, rowsData?: RowsData, scrollVertical?: DataScrollVertical): number;
    parentsExpanded(rowId: string): boolean;
    setAllRowsIdsCache(rowsIds: string[]): void;
    resetRowsOverlappingCalculated(rowsData?: RowsData): void;
    fixOverlappedItems(rowItems: Item[], rowData: RowData): void;
    recalculateRowHeight(row: Row, rowData: RowData): number;
    calculateVisibleRowsHeights(): void;
    getRealChartHeight(withScrollBar?: boolean): number;
    getLastRowId(rowsWithParentsExpanded?: string[], verticalScroll?: DataScrollVertical): string;
    getLastRowIndex(rowsWithParentsExpanded?: string[], verticalScroll?: DataScrollVertical): number;
    private generateRowsPositionsMap;
    getRowPositionMapNode(topPosition: number, node?: rowsPositionsMapNode): rowsPositionsMapNode;
    measureRows(): number | any[];
    isRowVisible(rowId: string, rows?: Rows, rowsData?: RowsData): boolean;
    getVisibleRows(): string[];
    normalizeMouseWheelEvent(event: WheelEvent): WheelResult;
    resetHorizontalScroll(horizontalScroll?: DataScrollHorizontal): DataScrollHorizontal;
    resetVerticalScroll(verticalScroll?: DataScrollVertical): DataScrollVertical;
    limitHorizontalScrollToView(time?: DataChartTime): void;
    private calculateHorizontalScrollPosPxFromDates;
    setScrollLeftByPixels(offsetLeft: number): number;
    setScrollLeft(dataIndexOrDateId: number | string | undefined, offset?: number, time?: DataChartTime): number;
    scrollToTime(toTime: number, centered?: boolean): number;
    getScrollLeft(): DataScrollHorizontal;
    getScrollSize(type: 'horizontal' | 'vertical'): number;
    getLastPageDatesWidth(chartWidth: number, allDates: ChartTimeDates): {
        lastPageSize: number;
        lastPageCount: number;
    };
    calculateInitialChartWidth(withoutScrollBar?: boolean): number;
    getChartWidth(withoutScrollBar?: boolean): any;
    private isHorizontalScrollVisible;
    calculateHorizontalScrollSizeAndPosFromDates(totalViewDurationPx: number, time?: DataChartTime, scrollHorizontal?: DataScrollHorizontal, shouldUpdate?: boolean): DataScrollHorizontal;
    getLastPageRowsHeight(height: number, rowsWithParentsExpanded: string[]): {
        lastPageSize: number;
        lastPageCount: number;
    };
    calculateVerticalScrollSize(): void;
    setScrollTopByPixels(offsetTop: number): number;
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
    /**
     * Destroy things to release memory
     */
    destroy(): void;
}
//# sourceMappingURL=api.d.ts.map