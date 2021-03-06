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
    public constructor() {
        super(ReopenedEventTableSpecification.rows);
    }

    /**
     * parses a single ReopenedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed ReopenedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ReopenedEvent {
        return new ReopenedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_reopened_event main `,
            values: []
        };
    }

}