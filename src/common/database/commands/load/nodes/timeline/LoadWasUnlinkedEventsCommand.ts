import { QueryResultRow, QueryResult } from "pg";
import { WasUnlinkedEvent, WasUnlinkedEventTableSpecification } from "../../../../../nodes/timelineItems/WasUnlinkedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadWasUnlinkedEventsCommand extends LoadIssueTimelineItemsCommandBase<WasUnlinkedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(WasUnlinkedEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): WasUnlinkedEvent {
        return new WasUnlinkedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_category, resultRow.unlinked_by,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_wasUnlinkedEvent main `,
            values: []
        };
    }

}