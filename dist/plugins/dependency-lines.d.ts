import { htmlResult, Vido } from '../gstc';
export declare type LineType = 'straight' | 'square' | 'cubic' | 'quadratic';
export interface Options {
    type?: LineType;
    onLines?: ((lines: Line[]) => Line[])[];
}
export interface PluginData extends Options {
    lines: Line[];
}
export interface Point {
    x: number;
    y: number;
    content?: htmlResult;
}
export interface Line {
    x: number;
    y: number;
    width: number;
    height: number;
    topAnchor: number;
    bottomAnchor: number;
    type: LineType;
    points: Point[];
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=dependency-lines.d.ts.map