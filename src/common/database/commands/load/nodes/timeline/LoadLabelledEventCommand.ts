import { QueryResultRow, QueryResult } from "pg";
import { AssignedEvent, AssignedEventTableSpecification } from "../../../../../nodes/timelineItems/AssignedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";
import { LabelledEvent, LabelledEventTableSpecification } from "../../../../../nodes/timelineItems/LabelledEvent";

/**
 * command to load LabelledEvent
 */
export class LoadLabelledEventCommand extends LoadIssueTimelineItemsCommandBase<LabelledEvent> {

    /**
     * creates a new LoadLabelledEventCommand
     */
    public constructor() {
        super(LabelledEventTableSpecification.rows);
    }

    /**
     * parses a single LabelledEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed LabelledEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): LabelledEvent {
        return new LabelledEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue, resultRow.label, resultRow.deleted,
            resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_labelled_event", databaseManager);
    }

}