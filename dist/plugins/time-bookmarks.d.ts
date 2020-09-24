import { Vido } from '../gstc';
import { Color } from 'csstype';
export declare const pluginPath = "config.plugin.TimeBookmarks";
export declare const slotPath = "config.slots.chart.content";
export interface Bookmark {
    time: string | number;
    label: string;
    className?: string;
    color?: Color;
}
export interface InternalBookmark extends Bookmark {
    id: string;
    leftViewPx: number;
}
export interface Bookmarks {
    [key: string]: Bookmark;
}
export interface Options {
    enabled?: boolean;
    className?: string;
    bookmarks?: Bookmarks;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
