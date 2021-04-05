import { QueryResult, QueryResultRow } from "pg";
import { GlobalPermission, GlobalPermissionTableSpecification } from "../../../../nodes/GlobalPermission";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadPermissionsCommandBase } from "./LoadPermissionsCommandBase";

export class LoadGlobalPermissionsCommand extends LoadPermissionsCommandBase<GlobalPermission> {

    /**
     * Creates a new LoadGlobalPermissionsCommand
     */
    public constructor() {
        super(GlobalPermissionTableSpecification.rows);
    }

    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): GlobalPermission {
        return new GlobalPermission(databaseManager, resultRow.id, resultRow.authorizable_id, 
            resultRow.create_delete_projects, resultRow.create_delete_components, resultRow.global_admin);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("global_permission", databaseManager);
    }
}