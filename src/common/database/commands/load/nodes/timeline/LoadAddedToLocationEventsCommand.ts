import { QueryResultRow, QueryResult } from "pg";
import { AddedToLocationEvent, AddedToLocationEventTableSpecification } from "../../../../../nodes/timelineItems/AddedToLocationEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToLocationEvents
 */
export class LoadAddedToLocationEventsCommand extends LoadIssueTimelineItemsCommandBase<AddedToLocationEvent> {

    /**
     * creates a new AddedToLocationEventsCommand
     */
    public constructor() {
        super(AddedToLocationEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToLocationEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToLocationEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): AddedToLocationEvent {
        return new AddedToLocationEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.location, resultRow.deleted, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_added_to_location_event", databaseManager);
    }

}