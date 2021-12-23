/**
 * HighlightWeekends plugin
 *
 * @header  --gstc--header--
 */
import type { Vido } from '../gstc';
export interface Options {
    weekdays?: number[];
    className?: string;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=highlight-weekends.d.ts.map