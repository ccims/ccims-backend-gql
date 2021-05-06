import { QueryResultRow, QueryResult } from "pg";
import { ClosedEvent, ClosedEventTableSpecification } from "../../../../../nodes/timelineItems/ClosedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load ClosedEvents
 */
export class LoadClosedEventsCommand extends LoadIssueTimelineItemsCommandBase<ClosedEvent> {

    /**
     * creates a new LoadClosedEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(ClosedEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single ClosedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed ClosedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ClosedEvent {
        return new ClosedEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("closed_event", databaseManager);
    }

}