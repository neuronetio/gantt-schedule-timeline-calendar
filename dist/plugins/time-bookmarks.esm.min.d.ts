import type { Vido } from '../gstc';
import type { Dayjs } from 'dayjs';
import type { StyleInfo, StyleMap } from '@neuronet.io/vido';
export declare const pluginPath = "config.plugin.TimeBookmarks";
export declare const slotPath = "config.slots.chart-timeline-items.outer";
export interface Bookmark {
    time: string | number;
    label: string;
    className?: string;
    color?: string;
    style?: StyleInfo;
}
export interface InternalBookmark extends Bookmark {
    id: string;
    leftViewPx: number;
    absoluteLeftPx: number;
    visible: boolean;
    date: Dayjs;
    styleMap: StyleMap;
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
