import { QueryResult, QueryResultRow } from "pg";
import { NonFunctionalConstraint, NonFunctionalConstraintTableSpecification } from "../../../../nodes/NonFunctionalConstraint";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createStringListFilter } from "./RelationFilter";

/**
 * Command to load NonFunctionalConstraints
 */
export class LoadNonFunctionalConstraintsCommand extends LoadSyncNodeListCommand<NonFunctionalConstraint> {
    /**
     * filter for timelineItems that are on any of the issues
     */
    public onIssues?: string[];

    /**
     * Only loads the NonFunctionalConstraint where the isActive state matches
     * a NonFunctionalConstraint is active if it is currently on its issue
     * undefined matches both true and false
     */
    public isActive?: boolean;

    /**
     * creates a new LoadNonFunctionalConstraintsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(NonFunctionalConstraintTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a Label
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed Label
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): NonFunctionalConstraint {
        return new NonFunctionalConstraint(databaseManager, resultRow.id, resultRow.issue_id, resultRow.content, resultRow.description, resultRow.is_active,
            resultRow.created_by, resultRow.created_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("non_functional_constraint", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onIssues !== undefined) {
            conditions.conditions.push(createStringListFilter("issue_id", this.onIssues, i));
            conditions.i++;
        }

        if (this.isActive !== undefined) {
            conditions.conditions.push({
                text: `is_active=$${conditions.i}`,
                values: [this.isActive],
                priority: 2
            });
            conditions.i++;
        }

        return conditions;
    }
}