/**
 * Selection plugin
 *
 * @header  --gstc--header--
 */
import { ITEM, ITEM_TYPE, CELL, CELL_TYPE, TimelinePointerPoint, TimelinePointerState } from './timeline-pointer';
import type { Item, GridCell, Vido } from '../gstc';
export type ModKey = 'shift' | 'ctrl' | 'alt' | '';
export interface SelectionItems {
    [key: string]: Item[];
}
export interface SelectState {
    selecting?: SelectionItems;
    selected?: SelectionItems;
}
export interface Events {
    onStart?: (lastSelected: EventSelection) => void;
    onSelecting?: (selecting: EventSelection, last: EventSelection) => EventSelection;
    onEnd?: (selected: EventSelection, last: EventSelection) => EventSelection;
}
export interface Options {
    enabled?: boolean;
    cells?: boolean;
    items?: boolean;
    showOverlay?: boolean;
    rectangularSelection?: boolean;
    multipleSelection?: boolean;
    selectKey?: ModKey;
    multiKey?: ModKey;
    selectedClassName?: string;
    selectingClassName?: string;
    bodySelectedClassName?: string;
    bodySelectingClassName?: string;
    events?: Events;
    pointerEvents?: PointerEvents;
    /**
     * @deprecated use `events.onStart`
     */
    onStart?: (lastSelected: EventSelection) => void;
    /**
     * @deprecated use `events.onSelecting`
     */
    onSelecting?: (selecting: EventSelection, last: EventSelection) => EventSelection;
    /**
     * @deprecated use `events.onEnd`
     */
    onSelected?: (selected: EventSelection, last: EventSelection) => EventSelection;
}
export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Selection {
    [CELL]: string[];
    [ITEM]: string[];
}
export type GridCellOrId = GridCell | string;
export type ItemOrId = Item | string;
export interface EventSelection {
    [CELL]: GridCellOrId[];
    [ITEM]: ItemOrId[];
}
export interface SelectedCell {
    rowId: string;
    cellId: string;
}
export interface PointerEvents {
    down: PointerEvent | null;
    move: PointerEvent | null;
    up: PointerEvent | null;
}
export interface PluginData extends Options {
    enabled: boolean;
    isSelecting: boolean;
    showOverlay: boolean;
    pointerState: TimelinePointerState;
    initialPosition: TimelinePointerPoint;
    currentPosition: TimelinePointerPoint;
    selectionAreaLocal: Area;
    selectionAreaGlobal: Area;
    selected: Selection;
    lastSelected: Selection;
    selecting: Selection;
    lastSelecting: Selection;
    automaticallySelected: Selection;
    pointerEvents: PointerEvents;
    events: Events;
    targetType: ITEM_TYPE | CELL_TYPE | '';
    targetData: any;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=selection.d.ts.map