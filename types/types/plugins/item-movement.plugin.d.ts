import { Vido, Item, DataChartTime, DataItems } from '../gstc';
import DeepState from 'deep-state-observer';
import { Point } from './timeline-pointer.plugin';
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
export interface Options {
    enabled?: boolean;
    dependant?: boolean;
    debug?: boolean;
    bodyClass?: string;
    itemClass?: string;
    events?: Events;
    snapToTime?: SnapToTime;
    threshold?: Threshold;
}
export declare type State = 'start' | 'move' | 'end' | '';
export interface PluginData extends Options {
    isMoving: boolean;
    initialItems: Item[];
    initialDependant: Item[];
    initialItemsData: DataItems;
    initialDependantData: DataItems;
    initialPosition: Point;
    currentPosition: Point;
    targetData: Item | null;
    state: State;
    movement: Movement;
    triggerDown: boolean | PointerEvent;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-movement.plugin.d.ts.map