import { QueryResultRow, QueryResult } from "pg";
import { AddedArtifactEvent, AddedArtifactEventTableSpecification } from "../../../../../nodes/timelineItems/AddedArtifactEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedArtifactEvents
 */
export class LoadAddedArtifactEventsCommand extends LoadIssueTimelineItemsCommandBase<AddedArtifactEvent> {

    /**
     * creates a new LoadAddedArtifactEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(AddedArtifactEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single AddedArtifactEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedArtifactEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): AddedArtifactEvent {
        return new AddedArtifactEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.artifact_id, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("added_artifact_event", databaseManager);
    }

}