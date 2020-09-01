import { Vido, htmlResult, Item, DataChartTime, DataItems } from '../gstc';
import DeepState from 'deep-state-observer';
import { Point } from './timeline-pointer.plugin';
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
export declare type State = 'start' | 'resize' | 'end' | '';
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
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-resizing.plugin.d.ts.map