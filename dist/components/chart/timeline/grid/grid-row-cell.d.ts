/**
 * ChartTimelineGridRowCell component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
import { Row, ChartTimeDate, Vido, htmlResult } from '../../../../gstc';
interface Props {
    id: string;
    row: Row;
    time: ChartTimeDate;
    content: string | htmlResult;
}
declare function ChartTimelineGridRowCell(vido: Vido, props: Props): () => any;
export default ChartTimelineGridRowCell;
//# sourceMappingURL=grid-row-cell.d.ts.map