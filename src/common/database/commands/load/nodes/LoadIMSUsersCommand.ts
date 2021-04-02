import { QueryResultRow, QueryResult } from "pg";
import { IMSUser } from "../../../../nodes/IMSUser";
import { DatabaseManager } from "../../../DatabaseManager";
import { LoadUsersCommandBase } from "./LoadUsersCommandBase";

/**
 * command to load a list of ims users
 */
export class LoadIMSUsersCommand extends LoadUsersCommandBase<IMSUser> {
    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSUser {
        return new IMSUser(databaseManager, resultRow.id, resultRow.username, resultRow.displayname, resultRow.email, resultRow.ims_data);
    }
}