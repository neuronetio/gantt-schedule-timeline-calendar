/**
 * ItemMovement plugin
 *
 * @header  --gstc--header--
 */
import type { Vido, Item, DataChartTime, ItemData, DataItems, DataScrollVertical, DataScrollHorizontal } from '../gstc';
import type DeepState from 'deep-state-observer';
import type { Dayjs } from 'dayjs';
export interface SnapArg {
    time: DataChartTime;
    movement: Movement;
    vido: Vido;
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
    onMove?: (onArg: OnArg) => Item[];
    onEnd?: (onArg: OnArg) => Item[];
}
export interface Threshold {
    horizontal?: number;
    vertical?: number;
}
export interface ScrollSpeed {
    horizontal?: number;
    vertical?: number;
}
export interface AutoScroll {
    speed?: ScrollSpeed;
    edgeThreshold?: Threshold;
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
    autoScroll?: AutoScroll;
    ignoreMissingDates?: boolean;
}
export declare type State = 'start' | 'move' | 'end' | '';
export interface PluginData extends Options {
    isMoving: boolean;
    initialItems: Item[];
    initialDependant: Item[];
    initialItemsData: DataItems;
    initialDependantData: DataItems;
    clickedItem: Item;
    clickedItemData: ItemData;
    initialVerticalScroll: DataScrollVertical;
    initialHorizontalScroll: DataScrollHorizontal;
    state: State;
    movement: Movement;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-movement.d.ts.map