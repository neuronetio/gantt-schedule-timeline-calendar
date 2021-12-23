/**
 * ExportPDF plugin
 *
 * @header  --gstc--header--
 */
import type { Vido } from '../gstc';
export declare const pluginName = "ExportPDF";
export declare const pluginPath: string;
export interface Options {
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=export-pdf.d.ts.map