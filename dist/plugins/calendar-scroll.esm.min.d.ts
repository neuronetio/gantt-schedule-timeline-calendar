/**
 * CalendarScroll plugin
 *
 * @header  --gstc--header--
 */
export interface Point {
    x: number;
    y: number;
}
export interface Options {
    enabled: boolean;
    bodyClassName: string;
}
export declare function Plugin(options?: Options): (vidoInstance: any) => () => void;
//# sourceMappingURL=calendar-scroll.d.ts.map