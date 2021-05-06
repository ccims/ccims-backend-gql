import { QueryResultRow, QueryResult } from "pg";
import { Role, RoleTableSpecification } from "../../../../nodes/Role";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNamedNodesCommand } from "./LoadNamedNodeCommand";

/**
 * Command to load a list of roles
 */
export class LoadRolesCommand extends LoadNamedNodesCommand<Role> {
    
    /**
     * creates a new LoadRolesCommand
     */
    public constructor() {
        super(RoleTableSpecification.rows);
    }

    /**
     * parses a Role
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed component
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Role {
        return new Role(databaseManager, resultRow.id, resultRow.name, resultRow.description);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("role", databaseManager);
    }

}