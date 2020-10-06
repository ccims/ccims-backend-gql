import { QueryResultRow, QueryResult } from "pg";
import { PriorityChangedEvent, PriorityChangedEventTableSpecification } from "../../../../../nodes/timelineItems/PriorityChangedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load PriorityChangedEvents
 */
export class LoadPriorityChangedEventsCommand extends LoadIssueTimelineItemsCommandBase<PriorityChangedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(PriorityChangedEventTableSpecification.rows);
    }

    /**
     * parses a single PriorityChangedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed PriorityChangedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): PriorityChangedEvent {
        return new PriorityChangedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_priority, resultRow.new_priority, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_priority_changed_event main `,
            values: []
        };
    }

}