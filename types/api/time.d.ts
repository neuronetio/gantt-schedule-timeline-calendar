import dayjs, { Dayjs } from 'dayjs';
import { DataChartTime, DataChartTimeLevelDate, ChartTimeDate, ScrollTypeHorizontal, Period, ChartCalendarLevel, ChartCalendarLevelFormat } from '../gstc';
import DeepState from 'deep-state-observer';
import { Api } from './api';
export interface CurrentDate {
    timestamp: number;
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
//# sourceMappingURL=time.d.ts.map