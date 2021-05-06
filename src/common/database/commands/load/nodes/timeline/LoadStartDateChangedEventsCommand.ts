import { QueryResultRow, QueryResult } from "pg";
import { StartDateChangedEvent, StartDateChangedEventTableSpecification } from "../../../../../nodes/timelineItems/StartDateChangedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load StartDateChangedEvents
 */
export class LoadStartDateChangedEventsCommand extends LoadIssueTimelineItemsCommandBase<StartDateChangedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(StartDateChangedEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single StartDateChangedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed StartDateChangedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): StartDateChangedEvent {
        return new StartDateChangedEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
           resultRow.old_start_date, resultRow.new_start_date, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("start_date_changed_event", databaseManager);
    }

}