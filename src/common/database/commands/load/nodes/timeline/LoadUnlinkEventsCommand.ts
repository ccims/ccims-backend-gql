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
    public constructor(loadDeleted: boolean = false) {
        super(UnlinkEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnlinkEvent {
        return new UnlinkEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.linked_issue_to_remove_id, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("unlink_event", databaseManager);
    }

}