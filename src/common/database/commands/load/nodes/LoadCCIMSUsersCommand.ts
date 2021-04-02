import { QueryResultRow, QueryResult } from "pg";
import { CCIMSUser } from "../../../../nodes/CCIMSUser";
import { DatabaseManager } from "../../../DatabaseManager";
import { LoadUsersCommandBase } from "./LoadUsersCommandBase";

/**
 * command to load a list of ims users
 */
export class LoadCCIMSUsersCommand extends LoadUsersCommandBase<CCIMSUser> {
    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): CCIMSUser {
        return new CCIMSUser(databaseManager, resultRow.id, resultRow.username, resultRow.displayname, resultRow.pw_hash, resultRow.email);
    }
}