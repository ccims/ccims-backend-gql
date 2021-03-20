import { DatabaseCommand } from "../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../DatabaseManager";
import { verifyIsAllowedSqlIdent } from "./SqlHelperFunctions";

/**
 * delets a CCIMSNode from the database
 */
export class DeleteNodeCommand extends DatabaseCommand<void> {

    /**
     * creates a new DeleteNodeCommand
     * @param id the id of the node to remove
     * @param tableName the table where to remove the node
     */
    public constructor(private readonly id: string, private readonly tableName: string) {
        super();
        verifyIsAllowedSqlIdent(tableName);
    }

    /**
     * generates the query
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: `DELETE FROM ${this.tableName} WHERE id=$1`,
            values: [this.id]
        };
    }

    /**
     * called when the query is finished
     * does nothing
     * @param databaseManager the databaseManager
     * @param result the result from the query
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

}