import { DataChartTime, DataChartTimeLevel, DataChartTimeLevelDate, ChartCalendarLevel, ChartTimeDate, ChartTimeDates, ChartCalendarLevelFormat, Vido, Reason } from '../gstc';
import { ListenerFunctionEventInfo } from 'deep-state-observer';
export default function main(vido: Vido): {
    className: string;
    styleMap: import("@neuronet.io/vido").StyleMap;
    initializePlugins(): void;
    heightChange(): void;
    resizerActiveChange(active: boolean): void;
    generateTreeFromVisibleRows(): void;
    generateTree(fullReload?: boolean): void;
    prepareExpanded(): void;
    calculateRowsHeight(): void;
    recalculateRowPercents(): void;
    getLastPageRowsHeight(innerHeight: number, rowsWithParentsExpanded: string[]): number;
    calculateVerticalScrollArea(): void;
    generateVisibleRowsAndItems(): void;
    resetScroll(): void;
    updateItemsVerticalPositions(): void;
    getMutedListeners(): any[];
    triggerLoadedEvent(): void;
    getLastPageDatesWidth(chartWidth: number, allDates: DataChartTimeLevelDate[]): number;
    generatePeriodDates(formatting: ChartCalendarLevelFormat, time: DataChartTime, level: ChartCalendarLevel, levelIndex: number): DataChartTimeLevel;
    limitGlobal(time: DataChartTime, oldTime: DataChartTime): DataChartTime;
    setCenter(time: DataChartTime): void;
    guessPeriod(time: DataChartTime, levels: ChartCalendarLevel[]): DataChartTime;
    calculateDatesPercents(allMainDates: DataChartTimeLevelDate[], chartWidth: number): number;
    getFormatAndLevelIndexForZoom(zoom: number, levels?: ChartCalendarLevel[]): {
        levelIndex: number;
        format: ChartCalendarLevelFormat;
    };
    generateAllDates(time: DataChartTime, levels: ChartCalendarLevel[], chartWidth: number): number;
    getPeriodDates(allLevelDates: ChartTimeDates, time: DataChartTime): ChartTimeDate[];
    updateLevels(time: DataChartTime, levels: ChartCalendarLevel[]): void;
    calculateTotalViewDuration(time: DataChartTime): void;
    calculateRightGlobal(leftGlobal: number, chartWidth: number, allMainDates: DataChartTimeLevelDate[]): number;
    updateVisibleItems(time?: DataChartTime, multi?: {
        update(updatePath: string, fn: any, options?: import("deep-state-observer").UpdateOptions): any;
        done(): void;
    } | {
        update(): void;
        done(): void;
    }): {
        update(updatePath: string, fn: any, options?: import("deep-state-observer").UpdateOptions): any;
        done(): void;
    } | {
        update(): void;
        done(): void;
    };
    recalculateTimes(reason: Reason): void;
    minimalReload(eventInfo: ListenerFunctionEventInfo): void;
    partialReload(fullReload: boolean, eventInfo: ListenerFunctionEventInfo): void;
    fullReload(eventInfo: ListenerFunctionEventInfo): void;
};
//# sourceMappingURL=main.d.ts.map