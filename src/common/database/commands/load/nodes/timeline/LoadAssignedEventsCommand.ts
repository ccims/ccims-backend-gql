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
    public constructor(loadDeleted: boolean = false) {
        super(AssignedEventTableSpecification.rows, loadDeleted);
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
           resultRow.assignee, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_assigned_event", databaseManager);
    }

}