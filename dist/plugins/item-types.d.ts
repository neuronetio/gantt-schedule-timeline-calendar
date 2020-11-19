import { Template, Vido } from '../gstc';
export declare const pluginPath = "config.plugin.ItemTypes";
export declare const templatePath = "config.templates.chart-timeline-items-row-item";
export interface Options {
    [key: string]: Template;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-types.d.ts.map