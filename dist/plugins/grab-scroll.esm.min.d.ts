/**
 * GrabScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 * @license   SEE LICENSE IN LICENSE FILE
 */
import type { Vido } from '../gstc';
export declare const pluginPath = "config.plugin.ItemTypes";
export declare const templatePath = "config.templates.chart-timeline-items-row-item";
export interface Options {
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=grab-scroll.d.ts.map