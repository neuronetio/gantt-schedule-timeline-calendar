/**
 * TimelinePointer plugin
 *
 * @header  --gstc--header--
 */
import type { Vido } from '../gstc';
export declare const CELL = "chart-timeline-grid-row-cell";
export type CELL_TYPE = 'chart-timeline-grid-row-cell';
export declare const ITEM = "chart-timeline-items-row-item";
export type ITEM_TYPE = 'chart-timeline-items-row-item';
export type SELECTION_TYPE = typeof CELL | typeof ITEM;
export interface TimelinePointerEvents {
    down: PointerEvent | null;
    move: PointerEvent | null;
    up: PointerEvent | null;
}
export interface TimelinePointerPoint {
    x: number;
    y: number;
}
export type TimelinePointerState = 'up' | 'down' | 'move';
export interface TimelinePointerCaptureEvents {
    up?: boolean;
    down?: boolean;
    move?: boolean;
}
export interface TimelinePointerLocked {
    up: boolean | string;
    down: boolean | string;
    move: boolean | string;
}
export interface Options {
    enabled?: boolean;
    captureEvents?: TimelinePointerCaptureEvents;
}
export interface TimelinePointerOffset {
    top: number;
    left: number;
}
export interface Movement {
    x: number;
    y: number;
}
export type TargetType = ITEM_TYPE | CELL_TYPE | '';
export interface PluginData extends Options {
    isMoving: boolean;
    pointerState: TimelinePointerState;
    currentTarget: HTMLElement | null;
    realTarget: HTMLElement | null;
    targetType: TargetType;
    targetData: any | null;
    events: TimelinePointerEvents;
    initialPosition: TimelinePointerPoint;
    currentPosition: TimelinePointerPoint;
    movement: Movement;
}
export interface ScrollPosPx {
    horizontal: number;
    vertical: number;
}
export interface TimelinePointerEvent {
    type: TimelinePointerState;
    originalEvent: PointerEvent;
    targetElement: HTMLElement;
    targetData: any;
    targetType: TargetType;
    initialScrollPosPx: ScrollPosPx;
    initialScrollOffset: TimelinePointerOffset;
    initialPosition: TimelinePointerPoint;
    currentPosition: TimelinePointerPoint;
    movement: Movement;
    isMoving: boolean;
    allEvents: TimelinePointerEvents;
}
export type PointerListener = (event: TimelinePointerEvent) => void;
export interface ApiPointerListeners {
    down: Set<PointerListener>;
    move: Set<PointerListener>;
    up: Set<PointerListener>;
}
export type AddPointerListener = (type: TimelinePointerState, callback: PointerListener) => void;
export type RemovePointerListener = (type: TimelinePointerState, callback: PointerListener) => void;
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=timeline-pointer.d.ts.map