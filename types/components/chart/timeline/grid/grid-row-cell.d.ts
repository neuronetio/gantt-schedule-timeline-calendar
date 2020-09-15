import { Row, ChartTimeDate, Vido, htmlResult } from '../../../../gstc';
interface Props {
    id: string;
    row: Row;
    time: ChartTimeDate;
    content: null | string | htmlResult;
}
declare function ChartTimelineGridRowCell(vido: Vido, props: Props): () => any;
export default ChartTimelineGridRowCell;
//# sourceMappingURL=grid-row-cell.d.ts.map