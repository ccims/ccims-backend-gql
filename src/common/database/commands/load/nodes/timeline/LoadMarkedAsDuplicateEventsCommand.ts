import { QueryResultRow, QueryResult } from "pg";
import { MarkedAsDuplicateEvent, MarkedAsDuplicateEventTableSpecification } from "../../../../../nodes/timelineItems/MarkedAsDuplicateEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load MarkedAsDuplicateEvents
 */
export class LoadMarkedAsDuplicateEventsCommand extends LoadIssueTimelineItemsCommandBase<MarkedAsDuplicateEvent> {

    /**
     * creates a new LoadMarkedAsDuplicateEventsCommand
     */
    public constructor() {
        super(MarkedAsDuplicateEventTableSpecification.rows);
    }

    /**
     * parses a single MarkedAsDuplicateEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed MarkedAsDuplicateEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): MarkedAsDuplicateEvent {
        return new MarkedAsDuplicateEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.deleted,  resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_marked_as_duplicate_event", databaseManager);
    }

}