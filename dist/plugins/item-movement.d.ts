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
    item: Item | null;
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
    addedDependantIds: string[];
    selectedIds: string[];
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
    timeout?: number;
}
export interface AutoScroll {
    speed?: ScrollSpeed;
    edgeThreshold?: Threshold;
}
export interface Options {
    enabled?: boolean;
    dependant?: boolean;
    moveDependantVertically?: boolean;
    debug?: boolean;
    bodyClass?: string;
    itemClass?: string;
    events?: Events;
    snapToTime?: SnapToTime;
    threshold?: Threshold;
    autoScroll?: AutoScroll;
    ignoreMissingDates?: boolean;
    allowItemsToGoOutsideTheArea?: boolean;
    shouldMuteNotNeededMethods?: boolean;
}
export type State = 'start' | 'move' | 'end' | '';
export interface ThresholdReached {
    horizontal: boolean;
    vertical: boolean;
}
export interface PluginData extends Options {
    isMoving: boolean;
    initialItems: Item[];
    initialItemsData: DataItems;
    addedDependantIds: string[];
    selectedIds: string[];
    clickedItem: Item;
    clickedItemData: ItemData;
    initialVerticalScroll: DataScrollVertical;
    initialHorizontalScroll: DataScrollHorizontal;
    initialPointerTime: Dayjs | null;
    thresholdReached: ThresholdReached;
    state: State;
    movement: Movement;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-movement.d.ts.map