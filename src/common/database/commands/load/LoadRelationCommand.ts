import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { DatabaseManager } from "../../DatabaseManager";

/**
 * command to load a relation
 */
export class LoadRelationCommand extends DatabaseCommand<string[]> {
    /**
     * the command used to load the relation
     */
    private readonly config: QueryConfig<any[]>;
    /**
     * the column where to find the result
     */
    private readonly resultColumn: string;

    /**
     * command to load all ids from a relation table, with a given id
     * WARNING: only id is secured against sql injections, use tableName, primary, secundary 
     * and filterByColumn only with constants and NEVER with user data
     * @param tableName the name of the relation table
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     * @param filterByPrimary if true, primary is used for the filter and secundary is the result,
     *                        if false, secundary is used for the filter and primary is the result,
     * @param id the id to filter with
     */
    public constructor(tableName: string, primary: string, secundary: string, filterByPrimary: boolean, id: string) {
        super();
        this.config = {
            text: `SELECT ${primary}, ${secundary} FROM ${tableName} WHERE ${filterByPrimary ? primary : secundary}=$1;`,
            values: [id]
        };
        this.resultColumn = filterByPrimary ? secundary : primary;
    }

    /**
     * returnes the query config
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return this.config;
    }

    /**
     * called when the query is finished
     * sets the result
     * 
     * @param databaseManager the databaseManager to use
     * @param result the result from the query
     * @returns follow up commands
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row[this.resultColumn]);
        return [];
    }

    /**
     * creates a generator for a LoadRelationCommand for properties on the primary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromPrimary(primary: string, secundary: string): ((node: CCIMSNode) => DatabaseCommand<string[]>) {
        return (node) => new LoadRelationCommand(`relation_${primary}_${secundary}`, primary + "_id", secundary + "_id", true, node.id);
    }

    /**
     * creates a generator for a LoadRelationCommand for properties on the secundary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromSecundary(primary: string, secundary: string): ((node: CCIMSNode) => DatabaseCommand<string[]>) {
        return (node) => new LoadRelationCommand(`relation_${primary}_${secundary}`, primary + "_id", secundary + "_id", false, node.id);
    }

}