import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { NodeCache } from "../../NodeCache";
import { CCIMSNode } from "../../../nodes/CCIMSNode";

export class LoadRelationCommand extends DatabaseCommand<string[]> {

    private readonly config: QueryConfig<any[]>;
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

    public getQueryConfig(): QueryConfig<any[]> {
        return this.config;
    }
    protected getResultInternal(nodeCache: NodeCache, result: QueryResult<any>): string[] {
        return result.rows.map(row => row[this.resultColumn]);
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