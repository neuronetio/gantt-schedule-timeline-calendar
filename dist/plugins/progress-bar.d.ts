/**
 * ProgressBar plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 * @license   SEE LICENSE IN LICENSE FILE
 */
import type { Vido } from '../gstc';
export declare const pluginPath = "config.plugin.ProgressBar";
export interface Options {
    enabled?: boolean;
    className?: string;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=progress-bar.d.ts.map