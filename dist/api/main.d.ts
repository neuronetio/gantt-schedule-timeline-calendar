import { Dayjs } from 'dayjs';
import { DataChartTime, DataChartTimeLevel, DataChartTimeLevelDate, ChartCalendarLevel, ChartTimeDate, ChartTimeDates, ChartCalendarLevelFormat, Vido, Reason } from '../gstc';
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
    generateAllDates(time: DataChartTime, levels: ChartCalendarLevel[]): 0 | ChartTimeDates[];
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
//# sourceMappingURL=main.d.ts.map