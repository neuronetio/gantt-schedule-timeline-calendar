/**
 * ExportPDF plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 * @license   SEE LICENSE IN LICENSE FILE
 */
import type { Vido } from '../gstc';
export declare const pluginName = "ExportPDF";
export declare const pluginPath: string;
export interface Options {
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=export-pdf.d.ts.map