/**
 * Main api
 *
 * @header  --gstc--header--
 */
import { Dayjs } from 'dayjs';
import { DataChartTime, DataChartTimeLevel, DataChartTimeLevelDate, ChartCalendarLevel, ChartTimeDate, ChartTimeDates, ChartCalendarLevelFormat, Item, Vido, Reason, DataScrollHorizontal } from '../gstc';
export default function main(vido: Vido, mergeDeep: any): {
    className: string;
    styleMap: import("@neuronet.io/vido").StyleMap;
    initializePlugins(): void;
    heightChange(): void;
    resizerActiveChange(active: boolean): void;
    generateTreeFromVisibleRows(): void;
    generateTree(fullReload?: boolean): void;
    prepareExpanded(): void;
    generateVisibleRowsAndItems(): void;
    updateItemsVerticalPositionsOfVisibleRows(): void;
    getMutedListeners(): any[];
    triggerLoadedEvent(): void;
    getLastPageDatesWidth(chartWidth: number, allDates: DataChartTimeLevelDate[]): number;
    formatDate(formatting: ChartCalendarLevelFormat, date: DataChartTimeLevelDate, localeName: string): import("../gstc").htmlResult;
    generatePeriodDates(formatting: ChartCalendarLevelFormat, time: DataChartTime, level: ChartCalendarLevel, levelIndex: number): DataChartTimeLevel;
    limitGlobal(time: DataChartTime): DataChartTime;
    setCenter(time: DataChartTime): void;
    guessPeriod(time: DataChartTime, levels: ChartCalendarLevel[]): DataChartTime;
    getFormatAndLevelIndexForZoom(zoom: number, levels?: ChartCalendarLevel[]): {
        levelIndex: number;
        format: ChartCalendarLevelFormat;
    };
    generateAllDates(time: DataChartTime, levels: ChartCalendarLevel[]): ChartTimeDates[];
    getPeriodDatesAndCalculateViewOffsetFromAllDates(allLevelDates: ChartTimeDates, time: DataChartTime): ChartTimeDate[];
    updateLevels(time: DataChartTime, levels: ChartCalendarLevel[]): void;
    updateLocale(): void;
    calculateTotalViewDurationFromDates(time: DataChartTime): void;
    calculateRightGlobal(leftGlobalDate: Dayjs, chartWidth: number, allMainDates: DataChartTimeLevelDate[], offsetPx: any, offsetMs: any): number;
    updateViewPortVisibleItems(justSetWithoutNotify?: boolean, time?: DataChartTime): Item[];
    updateViewPortVisibleItemsPositions(time?: DataChartTime, multi?: import("deep-state-observer").Multi): import("deep-state-observer").Multi;
    calculateLeftAndRightGlobalNormally(time: DataChartTime, horizontalScroll: DataScrollHorizontal): void;
    calculateLeftAndRightGlobalFromCenter(time: DataChartTime, oldDataTime: DataChartTime, horizontalScroll: DataScrollHorizontal): void | DataChartTime;
    updateFromToBasedOnDates(time: DataChartTime): void;
    recalculateTimes(reasons: Reason[]): void;
    minimalReload(eventInfo: any, bulk: any): void;
    partialReload(fullReload: boolean, eventInfo: any, bulk: any): void;
    fullReload(eventInfo: any, bulk: any): void;
};
//# sourceMappingURL=main.d.ts.map