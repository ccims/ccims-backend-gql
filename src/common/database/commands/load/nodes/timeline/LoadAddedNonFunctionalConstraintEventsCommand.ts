import { QueryResultRow, QueryResult } from "pg";
import { AddedNonFunctionalConstraintEvent, AddedNonFunctionalConstraintEventTableSpecification } from "../../../../../nodes/timelineItems/AddedNonFunctionalConstraintEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedNonFunctionalConstraintEvents
 */
export class LoadAddedNonFunctionalConstraintEventsCommand extends LoadIssueTimelineItemsCommandBase<AddedNonFunctionalConstraintEvent> {

    /**
     * creates a new LoadAddedNonFunctionalConstraintEventsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(AddedNonFunctionalConstraintEventTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single AddedNonFunctionalConstraintEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedNonFunctionalConstraintEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): AddedNonFunctionalConstraintEvent {
        return new AddedNonFunctionalConstraintEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.non_functional_constraint, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("added_non_functional_constraint_event", databaseManager);
    }

}