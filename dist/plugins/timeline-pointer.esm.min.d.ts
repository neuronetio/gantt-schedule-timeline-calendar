import type { Vido } from '../gstc';
export declare const CELL = "chart-timeline-grid-row-cell";
export declare type CELL_TYPE = 'chart-timeline-grid-row-cell';
export declare const ITEM = "chart-timeline-items-row-item";
export declare type ITEM_TYPE = 'chart-timeline-items-row-item';
export declare type SELECTION_TYPE = typeof CELL | typeof ITEM;
export interface PointerEvents {
    down: PointerEvent | null;
    move: PointerEvent | null;
    up: PointerEvent | null;
}
export interface Point {
    x: number;
    y: number;
}
export declare type PointerState = 'up' | 'down' | 'move';
export interface CaptureEvents {
    up?: boolean;
    down?: boolean;
    move?: boolean;
}
export interface Locked {
    up: boolean | string;
    down: boolean | string;
    move: boolean | string;
}
export interface Options {
    enabled?: boolean;
    captureEvents?: CaptureEvents;
}
export interface Offset {
    top: number;
    left: number;
}
export interface Movement {
    x: number;
    y: number;
}
export interface PluginData extends Options {
    isMoving: boolean;
    pointerState: PointerState;
    currentTarget: HTMLElement | null;
    realTarget: HTMLElement | null;
    targetType: ITEM_TYPE | CELL_TYPE | '';
    targetData: any | null;
    events: PointerEvents;
    initialPosition: Point;
    currentPosition: Point;
    movement: Movement;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
