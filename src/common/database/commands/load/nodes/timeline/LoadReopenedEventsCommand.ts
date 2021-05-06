import { QueryResultRow, QueryResult } from "pg";
import { ReopenedEvent, ReopenedEventTableSpecification } from "../../../../../nodes/timelineItems/ReopenedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load ReopenedEvents
 */
export class LoadReopenedEventsCommand extends LoadIssueTimelineItemsCommandBase<ReopenedEvent> {

    /**
     * creates a new LoadReopenedEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(ReopenedEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single ReopenedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed ReopenedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ReopenedEvent {
        return new ReopenedEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("reopened_event", databaseManager);
    }

}