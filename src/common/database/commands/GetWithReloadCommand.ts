import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../nodes/CCIMSNode";
import { DatabaseCommand } from "../DatabaseCommand";
import { DatabaseManager } from "../DatabaseManager";
import { LoadNodeListCommand } from "./load/nodes/LoadNodeListCommand";

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
    }

    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: `SELECT ${this.rowName} FROM ${this.node._tableSpecification.tableName} WHERE id=$1`,
            values: [this.node.id]
        }
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        if (result.rowCount > 0) {
            this.loadCommand.ids = [result.rows[0][this.rowName]];
            return [this.loadCommand]
        } else {
            throw new Error("cant reload element, probably deleted")
        }
    }

    public getResult(): T | undefined {
        const res = this.loadCommand.getResult();
        return res[0];
    }

}