import { DatabaseCommand } from "../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../DatabaseManager";

/**
 * delets a CCIMSNode from the database
 */
export class DeleteNodeCommand extends DatabaseCommand<void> {

    /**
     * creates a new DeleteNodeCommand
     * @param id the id of the node to remove
     * @param table the table where to remove the node
     */
    public constructor(private readonly id: string, private readonly table: string) {
        super();
    }

    /**
     * generates the query
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: `DELETE FROM ${this.table} WHERE id=$1`,
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