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
    public constructor(loadDeleted: boolean = false) {
        super(RenamedTitleEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single RenamedTitleEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RenamedTitleEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RenamedTitleEvent {
        return new RenamedTitleEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
           resultRow.old_title, resultRow.new_title, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("renamed_title_event", databaseManager);
    }

}