import { QueryResultRow, QueryResult } from "pg";
import { DueDateChangedEvent, DueDateChangedEventTableSpecification } from "../../../../../nodes/timelineItems/DueDateChangedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load DueDateChangedEvents
 */
export class LoadDueDateChangedEventsCommand extends LoadIssueTimelineItemsCommandBase<DueDateChangedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(DueDateChangedEventTableSpecification.rows);
    }

    /**
     * parses a single DueDateChangedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed DueDateChangedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): DueDateChangedEvent {
        return new DueDateChangedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_due_date, resultRow.new_due_date, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the due of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_dueDateChangedEvent main `,
            values: []
        };
    }

}