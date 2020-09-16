import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { DatabaseCommand } from "../../../DatabaseCommand";
import { DatabaseManager } from "../../../DatabaseManager";
import { getLoadCommand } from "./LoadFromIdsCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a single node
 */
export class LoadNodeCommand extends DatabaseCommand<CCIMSNode | undefined> {

    /**
     * the command which actually loads the node
     */
    private _nodeCommand?: LoadNodeListCommand<CCIMSNode>;

    /**
     * creates a command to load a node
     * @param id the id to get the node for
     */
    public constructor(private readonly id: string) {
        super();
    }

    /**
     * generates the query
     * selects the name of the table where to find the node
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: "SELECT pg_class.relname FROM node INNER JOIN pg_class ON (node.tableoid = pg_class.oid) WHERE node.id = $1;",
            values: [this.id]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the result of the query
     * @returns the command which actually loads the node
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        if (result.rowCount > 0) {
            this._nodeCommand = getLoadCommand(result.rows[0]["relname"], [this.id]);
            return [this._nodeCommand];
        } else {
            return [];
        }
    }

    /**
     * gets the result of this query as soon as it is available
     * this method caches the result automatically
     * this can be overwritten to change the behaviour
     * @throws error if no result is set, if this behaviour is unwanted, it is necessary to overwrite this method
     */
    public getResult(): CCIMSNode | undefined {
        const results = this._nodeCommand?.getResult();
        if (results && results.length > 0) {
            return results[0];
        } else {
            return undefined;
        }
    }
    
}