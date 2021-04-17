import { QueryResultRow, QueryResult } from "pg";
import { AddedToComponentEvent, AddedToComponentEventTableSpecification } from "../../../../../nodes/timelineItems/AddedToComponentEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadAddedToComponentEventsCommand extends LoadIssueTimelineItemsCommandBase<AddedToComponentEvent> {

    /**
     * creates a new LoadAddedToComponentEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(AddedToComponentEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): AddedToComponentEvent {
        return new AddedToComponentEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.component_id, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("added_to_component_event", databaseManager);
    }

}