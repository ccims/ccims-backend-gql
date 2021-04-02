import { QueryResultRow, QueryResult } from "pg";
import { UnassignedEvent, UnassignedEventTableSpecification } from "../../../../../nodes/timelineItems/UnassignedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load UnassignedEvents
 */
export class LoadUnassignedEventsCommand extends LoadIssueTimelineItemsCommandBase<UnassignedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(UnassignedEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single UnassignedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed UnassignedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnassignedEvent {
        return new UnassignedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.removedAssignee, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_unassigned_event", databaseManager);
    }

}