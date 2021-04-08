import { QueryResultRow, QueryResult } from "pg";
import { UnpinnedEvent, UnpinnedEventTableSpecification } from "../../../../../nodes/timelineItems/UnpinnedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadUnpinnedEventsCommand extends LoadIssueTimelineItemsCommandBase<UnpinnedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(UnpinnedEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnpinnedEvent {
        return new UnpinnedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.component, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("unpinned_event", databaseManager);
    }

}