import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../nodes/CCIMSNode";
import { DatabaseCommand } from "../DatabaseCommand";
import { DatabaseManager } from "../DatabaseManager";
import { LoadNodeListCommand } from "./load/nodes/LoadNodeListCommand";
import { verifyIsAllowedSqlIdent } from "./SqlHelperFunctions";

/**
 * command to reload a element on a relation on the one side
 */
export class GetWithReloadCommand<T extends CCIMSNode> extends DatabaseCommand<T | undefined> {

    /**
     * @param node: the node which should be reloaded
     * @param rowName the row which represents the one-relation
     *      NOT SECURED AGAINST SQL INJECTIONS!
     *      only use hardcoded strings!
     * @param loadCommand the command to load the new element with the new id
     *      warning: this is modified
     */
    public constructor(private readonly node: CCIMSNode, private readonly rowName: string, private readonly loadCommand: LoadNodeListCommand<T>) {
        super();
        verifyIsAllowedSqlIdent(this.node._tableSpecification.tableName);
        verifyIsAllowedSqlIdent(rowName);
    }

    /**
     * generates the query config
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: `SELECT ${this.rowName} FROM ${this.node._tableSpecification.tableName} WHERE id=$1`,
            values: [this.node.id]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the query result
     * @returns the command which actually loads the node
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        if (result.rowCount > 0) {
            this.loadCommand.ids = [result.rows[0][this.rowName]];
            return [this.loadCommand]
        } else {
            throw new Error("cant reload element, probably deleted")
        }
    }

    /**
     * gets the node result or undefined if the node cannot be loaded
     */
    public getResult(): T | undefined {
        const res = this.loadCommand.getResult();
        return res[0];
    }

}