import { QueryResultRow, QueryResult } from "pg";
import { AssignedEvent, AssignedEventTableSpecification } from "../../../../../nodes/timelineItems/AssignedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AssignedEvents
 */
export class LoadAssignedEventsCommand extends LoadIssueTimelineItemsCommandBase<AssignedEvent> {

    /**
     * creates a new LoadAssignedEventsCommand
     */
    public constructor() {
        super(AssignedEventTableSpecification.rows);
    }

    /**
     * parses a single AssignedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AssignedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): AssignedEvent {
        return new AssignedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.assignee, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_assignedEvent main `,
            values: []
        };
    }

}