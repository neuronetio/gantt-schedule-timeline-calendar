export interface Point {
    x: number;
    y: number;
}
export interface Options {
    enabled: boolean;
    bodyClassName: string;
}
export declare function Plugin(options?: Options): (vidoInstance: any) => () => void;
//# sourceMappingURL=calendar-scroll.plugin.d.ts.map