import { QueryResultRow, QueryResult } from "pg";
import { RemovedFromLocationEvent, RemovedFromLocationEventTableSpecification } from "../../../../../nodes/timelineItems/RemovedFromLocationEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load RemovedFromLocationEvents
 */
export class LoadRemovedFromLocationEventsCommand extends LoadIssueTimelineItemsCommandBase<RemovedFromLocationEvent> {

    /**
     * creates a new LoadRemovedFromLocationEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(RemovedFromLocationEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single RemovedFromLocationEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RemovedFromLocationEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RemovedFromLocationEvent {
        return new RemovedFromLocationEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.location, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("removed_from_location_event", databaseManager);
    }

}