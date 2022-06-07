/**
 * Gantt-Schedule-Timeline-Calendar Time api
 *
 * @header  --gstc--header--
 */
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { DataChartTime, DataChartTimeLevelDate, ChartTimeDate, Period, ChartCalendarLevel, ChartCalendarLevelFormat } from '../gstc';
import type DeepState from 'deep-state-observer';
import type { Api } from './api';
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
export declare class Time {
    private locale;
    private utcMode;
    private state;
    private api;
    private dayjs;
    currentDate: CurrentDate;
    unsubs: (() => void)[];
    constructor(state: DeepState, api: Api);
    destroy(): void;
    private resetCurrentDate;
    date(time?: number | string | Date | undefined): dayjs.Dayjs;
    private addAdditionalSpace;
    recalculateFromTo(time: DataChartTime, force?: boolean): DataChartTime;
    getCenter(time: DataChartTime): number;
    isInCurrentView(date: Dayjs, time?: DataChartTime): boolean;
    getGlobalOffsetPxFromDates(date: Dayjs, time?: DataChartTime): number;
    getViewOffsetPxFromDates(date: Dayjs, limitToView?: boolean, time?: DataChartTime): number;
    limitOffsetPxToView(x: number, time?: DataChartTime): number;
    findDateAtViewOffsetPx(offsetPx: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
    findDateAtTime(milliseconds: number, allPeriodDates?: ChartTimeDate[]): ChartTimeDate | undefined;
    getMainDateFromRelativePosition(fromDate: ChartTimeDate, relativePosPx: number): ChartTimeDate | undefined;
    getTimeFromOffsetPx(offsetPx: number, isViewOffset?: boolean, time?: DataChartTime): number;
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
//# sourceMappingURL=time.d.ts.map