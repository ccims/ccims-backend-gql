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
    public constructor(loadDeleted: boolean = false) {
        super(PriorityChangedEventTableSpecification.rows, loadDeleted);
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
           resultRow.old_priority, resultRow.new_priority, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("priority_changed_event", databaseManager);
    }

}