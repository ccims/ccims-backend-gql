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
    public constructor() {
        super(StartDateChangedEventTableSpecification.rows);
    }

    /**
     * parses a single StartDateChangedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed StartDateChangedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): StartDateChangedEvent {
        return new StartDateChangedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_start_date, resultRow.new_start_date, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_start_date_changed_event main `,
            values: []
        };
    }

}