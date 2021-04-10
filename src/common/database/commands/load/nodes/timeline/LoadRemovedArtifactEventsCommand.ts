import { QueryResultRow, QueryResult } from "pg";
import { RemovedArtifactEvent, RemovedArtifactEventTableSpecification } from "../../../../../nodes/timelineItems/RemovedArtifactEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load RemovedArtifactEvents
 */
export class LoadRemovedArtifactEventsCommand extends LoadIssueTimelineItemsCommandBase<RemovedArtifactEvent> {

    /**
     * creates a new RemovedArtifactEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(RemovedArtifactEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single RemovedArtifactEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RemovedArtifactEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RemovedArtifactEvent {
        return new RemovedArtifactEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.artifact, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("removed_artifact_event", databaseManager);
    }

}