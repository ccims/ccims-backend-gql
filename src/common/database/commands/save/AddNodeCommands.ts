import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { RowSpecification } from "../../../nodes/NodeTableSpecification";

/**
 * command which adds a CCIMSNode to the database
 * @param T the type of node
 */
export class AddNodeCommand<T extends CCIMSNode> extends DatabaseCommand<void> {
    /**
     * creates a new AddNodeCommand
     * @param node the node to add
     * @param table the name of the table where to add the node
     * @param rows the list of rows which should be saved
     */
    public constructor (private readonly node: T, private readonly table: string, private readonly rows: RowSpecification<T>[]) {
        super();
    }

    /**
     * generates a query config
     */
    public getQueryConfig(): QueryConfig<any[]> {
        const rowNames = this.rows.map(row => row.rowName).join(", ");
        const numbers = this.rows.map((row, index) => `$${index + 1}`).join(", ");
        return {
            text: `INSERT INTO ${this.table} (${rowNames}) VALUES (${numbers})`,
            values: this.rows.map(row => row.getValue(this.node))
        };
    }
    /**
     * called when the the query is finished
     * does nothing
     * @param databaseManager the databaseManager
     * @param result the result from the query
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }
}