import { QueryResultRow, QueryResult } from "pg";
import { UnmarkedAsDuplicateEvent, UnmarkedAsDuplicateEventTableSpecification } from "../../../../../nodes/timelineItems/UnmarkedAsDuplicateEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load UnmarkedAsDuplicateEvents
 */
export class LoadUnmarkedAsDuplicateEventsCommand extends LoadIssueTimelineItemsCommandBase<UnmarkedAsDuplicateEvent> {

    /**
     * creates a new LoadUnmarkedAsDuplicateEventsCommand
     */
    public constructor() {
        super(UnmarkedAsDuplicateEventTableSpecification.rows);
    }

    /**
     * parses a single UnmarkedAsDuplicateEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed UnmarkedAsDuplicateEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnmarkedAsDuplicateEvent {
        return new UnmarkedAsDuplicateEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_unmarked_as_duplicate_event", databaseManager);
    }

}