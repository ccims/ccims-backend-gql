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
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(RemovedFromComponentEventTableSpecification.rows);
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
           resultRow.old_category, resultRow.component,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_removedFromComponentEvent main `,
            values: []
        };
    }

}