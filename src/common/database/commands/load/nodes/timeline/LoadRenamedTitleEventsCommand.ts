import { QueryResultRow, QueryResult } from "pg";
import { RenamedTitleEvent, RenamedTitleEventTableSpecification } from "../../../../../nodes/timelineItems/RenamedTitleEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load RenamedTitleEvents
 */
export class LoadRenamedTitleEventsCommand extends LoadIssueTimelineItemsCommandBase<RenamedTitleEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(RenamedTitleEventTableSpecification.rows);
    }

    /**
     * parses a single RenamedTitleEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RenamedTitleEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RenamedTitleEvent {
        return new RenamedTitleEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_title, resultRow.new_title, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_renamed_title_event main `,
            values: []
        };
    }

}