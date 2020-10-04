import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { DatabaseManager } from "../../DatabaseManager";
import { verifyIsAllowedSqlIdent } from "../SqlHelperFunctions";

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
        verifyIsAllowedSqlIdent(tableName);
        verifyIsAllowedSqlIdent(primary);
        verifyIsAllowedSqlIdent(secundary);

        this.config = {
            text: `SELECT ${primary.toLowerCase()}, ${secundary.toLowerCase()} FROM ${tableName} WHERE ${filterByPrimary ? primary : secundary}=$1;`,
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
        this.result = result.rows.map(row => row[this.resultColumn.toLowerCase()]);
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

    /**
     * creates a generator for a command which loads a many to one relation property on the many side
     * @param tableName the name of the table on the one side
     * @param rowName the name of the row on the one side
     */
    public static fromManySide(tableName: string, rowName: string): ((node: CCIMSNode) => DatabaseCommand<string[]>) {
        return node => new LoadIdsManyOneCommand(tableName, rowName, node);
    }

    /**
     * creates a command which loads the one side
     * @param tableName the name of the table on the one side
     * @param rowName the name of the row on the one side
     */
    public static fromManySideBase(tableName: string, rowName: string, node: CCIMSNode):  DatabaseCommand<string[]> {
        return new LoadIdsManyOneCommand(tableName, rowName, node);
    }
}

/**
 * command to load a many to one relation from the many side
 */
class LoadIdsManyOneCommand extends DatabaseCommand<string[]> {

    /**
     * creates a new LoadIdsManyOneCommand
     * @param tableName the name of the table on the one side
     * @param rowName the name of the row on tableName
     * @param node the node on the many side
     */
    public constructor (private readonly tableName: string, private readonly rowName: string, private readonly node: CCIMSNode) {
        super();
        verifyIsAllowedSqlIdent(tableName);
        verifyIsAllowedSqlIdent(rowName);
    }

    /**
     * generates the query
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: `SELECT id from ${this.tableName} WHERE ${this.rowName} = $1`,
            values: [this.node.id]
        };
    }

    /**
     * parses the result from the query
     * @param databaseManager the databaseManager
     * @param result the result of the query
     * @param follow up commands
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row.id);
        return [];
    }

}