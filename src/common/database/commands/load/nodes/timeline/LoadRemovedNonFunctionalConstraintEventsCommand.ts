import { QueryResultRow, QueryResult } from "pg";
import { RemovedNonFunctionalConstraintEvent, RemovedNonFunctionalConstraintEventTableSpecification } from "../../../../../nodes/timelineItems/RemovedNonFunctionalConstraintEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load RemovedNonFunctionalConstraintEvents
 */
export class LoadRemovedNonFunctionalConstraintEventsCommand extends LoadIssueTimelineItemsCommandBase<RemovedNonFunctionalConstraintEvent> {

    /**
     * creates a new RemovedNonFunctionalConstraintEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(RemovedNonFunctionalConstraintEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single RemovedNonFunctionalConstraintEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed RemovedNonFunctionalConstraintEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): RemovedNonFunctionalConstraintEvent {
        return new RemovedNonFunctionalConstraintEvent(databaseManager, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.issue_id,
            resultRow.non_functional_constraint_id, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("removed_non_functional_constraint_event", databaseManager);
    }

}