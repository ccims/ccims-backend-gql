import { QueryResult, QueryResultRow } from "pg";
import { ComponentPermission, ComponentPermissionTableSpecification } from "../../../../nodes/ComponentPermission";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadPermissionsCommandBase } from "./LoadPermissionsCommandBase";
import { createStringListFilter } from "./RelationFilter";

export class LoadComponentPermissionsCommand extends LoadPermissionsCommandBase<ComponentPermission> {

    /**
     * Only selects ComponentPermissions which apply to at least of of the provided components
     */
    public components: string[] | undefined;

    /**
     * Creates a new LoadComponentPermissionsCommand
     */
    public constructor() {
        super(ComponentPermissionTableSpecification.rows);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.components !== undefined) {
            conditions.conditions.push(createStringListFilter("component_id", this.components, conditions.i, 4));
            conditions.i++;
        }

        return conditions;
    }

    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ComponentPermission {
        return new ComponentPermission(databaseManager, resultRow.id, resultRow.authorizable_id, resultRow.component_id, 
            resultRow.edit_issues, resultRow.moderate, resultRow.edit_issue_location, resultRow.component_admin, resultRow.change_ims, resultRow.link_issues, resultRow.read_component);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("component_permission", databaseManager);
    }
}