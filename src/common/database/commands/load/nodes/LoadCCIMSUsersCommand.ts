import { QueryResultRow, QueryResult } from "pg";
import { CCIMSUser, CCIMSUserTableSpecification } from "../../../../nodes/CCIMSUser";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadUsersCommandBase } from "./LoadUsersCommandBase";

/**
 * command to load a list of ims users
 */
export class LoadCCIMSUsersCommand extends LoadUsersCommandBase<CCIMSUser> {

    /**
     * creates a new LoadUsersCommand
     */
    public constructor() {
        super(CCIMSUserTableSpecification.rows);
    }

    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): CCIMSUser {
        return new CCIMSUser(databaseManager, resultRow.id, resultRow.username, resultRow.displayname, resultRow.pw_hash, resultRow.email);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("ccms_users", databaseManager);
    }
}