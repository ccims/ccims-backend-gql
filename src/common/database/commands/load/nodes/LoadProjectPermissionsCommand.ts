import { QueryResult, QueryResultRow } from "pg";
import { ProjectPermission, ProjectPermissionTableSpecification } from "../../../../nodes/ProjectPermission";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadPermissionsCommandBase } from "./LoadPermissionsCommandBase";
import { createStringListFilter } from "./RelationFilter";

export class LoadProjectPermissionsCommand extends LoadPermissionsCommandBase<ProjectPermission> {

    /**
     * Only selects ProjectPermissions which apply to at least of of the provided projects
     */
    public projects: string[] | undefined;

    /**
     * Creates a new LoadProjectPermissionsCommand
     */
    public constructor() {
        super(ProjectPermissionTableSpecification.rows);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.projects !== undefined) {
            conditions.conditions.push(createStringListFilter("project_id", this.projects, conditions.i, 4));
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
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ProjectPermission {
        return new ProjectPermission(databaseManager, resultRow.id, resultRow.authorizable_id, resultRow.project_id, 
            resultRow.add_remove_components, resultRow.project_admin, resultRow.read_project);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("project_permission", databaseManager);
    }
}