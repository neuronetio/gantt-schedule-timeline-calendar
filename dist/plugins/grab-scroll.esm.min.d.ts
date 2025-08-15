/**
 * GrabScroll plugin
 *
 * @header  --gstc--header--
 */
import type { Vido } from '../gstc';
export declare const pluginName = "GrabScroll";
export declare const pluginPath = "config.plugin.GrabScroll";
export declare const templatePath = "config.templates.chart-timeline-items-row-item";
export interface Options {
    enabled?: boolean;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=grab-scroll.d.ts.map