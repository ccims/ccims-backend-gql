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
    public constructor() {
        super(ClosedEventTableSpecification.rows);
    }

    /**
     * parses a single ClosedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed ClosedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ClosedEvent {
        return new ClosedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_closed_event main `,
            values: []
        };
    }

}