/**
 * CalendarScroll plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 * @license   SEE LICENSE IN LICENSE FILE
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