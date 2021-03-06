import { QueryResultRow, QueryResult } from "pg";
import { CategoryChangedEvent, CategoryChangedEventTableSpecification } from "../../../../../nodes/timelineItems/CategoryChangedEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load CategoryChangedEvents
 */
export class LoadCategoryChangedEventsCommand extends LoadIssueTimelineItemsCommandBase<CategoryChangedEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(CategoryChangedEventTableSpecification.rows);
    }

    /**
     * parses a single CategoryChangedEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed CategoryChangedEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): CategoryChangedEvent {
        return new CategoryChangedEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_category, resultRow.new_category, resultRow.deleted,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_category_changede_vent main `,
            values: []
        };
    }

}