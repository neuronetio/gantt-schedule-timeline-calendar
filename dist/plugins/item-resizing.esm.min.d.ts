/**
 * ItemResizing plugin
 *
 * @header  --gstc--header--
 */
import type { Vido, htmlResult, Item, DataChartTime, DataItems, DataScrollHorizontal } from '../gstc';
import type DeepState from 'deep-state-observer';
import type { Dayjs } from 'dayjs';
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
export declare type HandleContentFunction = ({ item: Item, vido: Vido }: {
    item: any;
    vido: any;
}) => HandleContentObject;
export declare type HandleContent = HandleContentObject | HandleContentFunction | htmlResult;
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
    ignoreMissingDates?: boolean;
}
export declare type State = 'start' | 'resize' | 'end' | '';
export interface PluginData extends Options {
    leftIsMoving: boolean;
    rightIsMoving: boolean;
    initialItems: Item[];
    initialDependant: Item[];
    initialItemsData: DataItems;
    initialDependantData: DataItems;
    initialHorizontalScroll: DataScrollHorizontal;
    state: State;
    movement: Movement;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-resizing.d.ts.map