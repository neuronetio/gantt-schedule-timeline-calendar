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
    dayjs: any;
    currentDate: CurrentDate;
    unsubs: (() => void)[];
    constructor(state: DeepState, api: Api);
    destroy(): void;
    private resetCurrentDate;
    date(time?: number | string | Date | undefined): dayjs.Dayjs;
    recalculateFromTo(time: DataChartTime, force?: boolean): DataChartTime;
    getCenter(time: DataChartTime): number;
    isInCurrentView(date: Dayjs, time?: DataChartTime): boolean;
    recalculateDatesPositions(dates: DataChartTimeLevelDate[], time?: DataChartTime, relativeToTime?: boolean, cloneDates?: boolean): DataChartTimeLevelDate[];
    addMissingDates(dates: DataChartTimeLevelDate[], date: Dayjs, time?: DataChartTime): DataChartTimeLevelDate[];
    /**
     * returns offset in pixels relative to time.from which is the first date in whole timeline
     */
    getGlobalOffsetPxFromDates(date: Dayjs, addMissingDates?: boolean, time?: DataChartTime, dates?: DataChartTimeLevelDate[]): number;
    /**
     * returns offset in pixels relative to time.leftGlobal which is left edge of what we see
     */
    getViewOffsetPxFromDates(date: Dayjs, limitToView?: boolean, time?: DataChartTime, dates?: DataChartTimeLevelDate[], addMissingDates?: boolean): number;
    limitOffsetPxToView(x: number, time?: DataChartTime): number;
    findDateAtViewOffsetPx(offsetPx: number, allPeriodDates: ChartTimeDate[]): ChartTimeDate | undefined;
    findDateAtTime(milliseconds: number, allPeriodDates?: ChartTimeDate[]): ChartTimeDate | undefined;
    getMainDateFromRelativePosition(fromDate: ChartTimeDate, relativePosPx: number): ChartTimeDate | undefined;
    getTimeFromOffsetPx(offsetPx: number, isViewOffset?: boolean, time?: DataChartTime, dates?: DataChartTimeLevelDate[]): number;
    getCurrentFormatForLevel(level: ChartCalendarLevel, time: DataChartTime): ChartCalendarLevelFormat;
    alignLevelToMain(levelIndex: number, currentLevelDates: DataChartTimeLevelDate[], time?: DataChartTime): DataChartTimeLevelDate[];
    private _generatePeriodDates;
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
    getDatesDiffPx(fromTime: Dayjs, toTime: Dayjs, time: DataChartTime, accurate?: boolean, dates?: DataChartTimeLevelDate[]): number;
    getLeftViewDate(time?: DataChartTime): ChartTimeDate | null;
    getRightViewDate(time?: DataChartTime): ChartTimeDate | null;
    getLowerPeriod(period: Period): Period;
    getHigherPeriod(period: Period): Period;
}
//# sourceMappingURL=time.d.ts.map