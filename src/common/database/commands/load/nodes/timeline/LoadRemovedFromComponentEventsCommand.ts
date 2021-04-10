import { QueryResultRow, QueryResult } from "pg";
import { RemovedFromComponentEvent, RemovedFromComponentEventTableSpecification } from "../../../../../nodes/timelineItems/RemovedFromComponentEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load RemovedFromComponentEvents
 */
export class LoadRemovedFromComponentEventsCommand extends LoadIssueTimelineItemsCommandBase<RemovedFromComponentEvent> {

    /**
     * creates a new RemovedFromComponentEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(RemovedFromComponentEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single RemovedFromComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RemovedFromComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RemovedFromComponentEvent {
        return new RemovedFromComponentEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.component, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("removed_from_component_event", databaseManager);
    }

}