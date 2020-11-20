import { QueryResultRow, QueryResult } from "pg";
import { UnlinkEvent, UnlinkEventTableSpecification } from "../../../../../nodes/timelineItems/UnlinkEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadUnlinkEventsCommand extends LoadIssueTimelineItemsCommandBase<UnlinkEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(UnlinkEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnlinkEvent {
        return new UnlinkEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.linked_issue_to_remove, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_unlink_event main `,
            values: []
        };
    }

}