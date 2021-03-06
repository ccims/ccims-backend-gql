import { QueryResultRow, QueryResult } from "pg";
import { PinnedEvent, PinnedEventTableSpecification } from "../../../../../nodes/timelineItems/PinnedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadPinnedEventsCommand extends LoadIssueTimelineItemsCommandBase<PinnedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(PinnedEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): PinnedEvent {
        return new PinnedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.component, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_pinned_event main `,
            values: []
        };
    }

}