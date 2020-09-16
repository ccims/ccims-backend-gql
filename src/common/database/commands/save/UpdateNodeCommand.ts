import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { RowSpecification } from "../../../nodes/NodeTableSpecification";
import { verifyIsAllowedSqlIdent } from "../SqlHelperFunctions";

/**
 * command to update a CCIMSNode in the database
 * @param T the type of CCIMSNode to update
 */
export class UpdateNodeCommand<T extends CCIMSNode> extends DatabaseCommand<void> {

    /**
     * creates a new UpdateNodeCommand
     * @param node  the node to save
     * @param tableName the table name where to save the node
     * @param rows the list of rows to save
     */
    public constructor (private readonly node: T, private readonly tableName: string, private readonly rows: RowSpecification<T>[]) {
        super();
        verifyIsAllowedSqlIdent(tableName);
        rows.forEach(row => verifyIsAllowedSqlIdent(row.rowName));
    }

    /**
     * generates the command
     */
    public getQueryConfig(): QueryConfig<any[]> {
        const rowNames = this.rows.reduce((str, row, index) => `${str}${row.rowName}=$${index + 2}, `, "");
        return {
            text: `UPDATE ${this.tableName} SET ${rowNames.substr(0, rowNames.length - 2)} WHERE id=$1`,
            values: [this.node.id, ...this.rows.map(row => row.getValue(this.node))]
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