/**
 * DependencyLines plugin
 *
 * @header  --gstc--header--
 */
import type { htmlResult, Item, ItemData, RowData, Vido } from '../gstc';
export type LineType = 'straight' | 'square' | 'square-alt' | 'smooth';
export interface DefaultPoint {
    content: htmlResult;
    width: number;
    height: number;
}
export interface Options {
    type?: LineType;
    onLines?: ((lines: Line[]) => Line[])[];
    onLine?: ((line: Line) => Line)[];
    leftPoint?: DefaultPoint;
    rightPoint?: DefaultPoint;
}
export interface PluginData extends Options {
    lines: Line[];
}
export interface Point {
    x: number;
    y: number;
    type: 'M' | 'L' | 'Q' | 'T' | 'C' | 'S' | '';
    content?: htmlResult;
}
export interface Line {
    x: number;
    y: number;
    width: number;
    height: number;
    topOffset: number;
    leftOffset: number;
    type: LineType;
    fromItemData: ItemData;
    toItemData: ItemData;
    fromItem: Item;
    toItem: Item;
    fromRowData: RowData;
    toRowData: RowData;
    points: Point[];
    className: string;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=dependency-lines.d.ts.map