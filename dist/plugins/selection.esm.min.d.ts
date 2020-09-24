import { ITEM, ITEM_TYPE, CELL, CELL_TYPE, Point, PointerState } from './timeline-pointer';
import { Item, GridCell, Vido } from '../gstc';
export declare type ModKey = 'shift' | 'ctrl' | 'alt' | '';
export interface SelectionItems {
    [key: string]: Item[];
}
export interface SelectState {
    selecting?: SelectionItems;
    selected?: SelectionItems;
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
    onSelecting?: (selecting: EventSelection, last: EventSelection) => EventSelection;
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
export declare type GridCellOrId = GridCell | string;
export declare type ItemOrId = Item | string;
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
    pointerState: PointerState;
    initialPosition: Point;
    currentPosition: Point;
    selectionAreaLocal: Area;
    selectionAreaGlobal: Area;
    selected: Selection;
    lastSelected: Selection;
    selecting: Selection;
    automaticallySelected: Selection;
    events: PointerEvents;
    targetType: ITEM_TYPE | CELL_TYPE | '';
    targetData: any;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
