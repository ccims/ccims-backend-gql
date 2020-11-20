import { QueryResultRow, QueryResult } from "pg";
import { WasLinkedEvent, WasLinkedEventTableSpecification } from "../../../../../nodes/timelineItems/WasLinkedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadWasLinkedEventsCommand extends LoadIssueTimelineItemsCommandBase<WasLinkedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(WasLinkedEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): WasLinkedEvent {
        return new WasLinkedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.linked_by, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_was_linked_event main `,
            values: []
        };
    }

}