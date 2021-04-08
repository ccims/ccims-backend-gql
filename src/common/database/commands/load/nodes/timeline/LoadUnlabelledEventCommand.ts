import { QueryResult, QueryResultRow } from "pg";
import { UnlabelledEvent, UnlabelledEventTableSpecification } from "../../../../../nodes/timelineItems/UnlabelledEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load UnlabelledEvent
 */
export class LoadUnlabelledEventCommand extends LoadIssueTimelineItemsCommandBase<UnlabelledEvent> {

    /**
     * creates a new LoadUnlabelledEventCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(UnlabelledEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single UnlabelledEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed UnlabelledEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): UnlabelledEvent {
        return new UnlabelledEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue, resultRow.label, resultRow.deleted,
            resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("unlabelled_event", databaseManager);
    }

}