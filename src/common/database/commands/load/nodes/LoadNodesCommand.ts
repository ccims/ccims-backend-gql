import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { DatabaseCommand } from "../../../DatabaseCommand";
import { DatabaseManager } from "../../../DatabaseManager";
import { verifyIsAllowedSqlIdent } from "../../SqlHelperFunctions";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadCommand } from "../LoadCommand";
import { QueryPart } from "../QueryPart";
import { getLoadCommand } from "./LoadFromIdsCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a single node
 */
export class LoadNodesCommand<T extends CCIMSNode> extends LoadCommand<T[]> {

    /**
     * filter by a list of ids
     * the priority for this filter is 1
     */
    public ids?: string[]

    /**
     * when used with a limit, if true the first n elements are returned
     * if false the last n elements are returned
     */
    public first: boolean = true;

    /**
     * limit the amount of results
     */
    public limit?: number;

    /**
     * returns only elements after elements with the specified id (exclusive)
     */
    public afterId?: string;

    /**
     * returns only elements before elements with the specified id (exclusive)
     */
    public beforeId?: string;

    /**
     * list of result ids
     */
    private resultIds?: string[];

    /**
     * list of follow up commands
     */
    private commands?: LoadNodeListCommand<T>[];

    /**
     * creates a command to load a node
     * @param tableName the name of the super table which contains all nodes
     * @param orderBy the column name to order the results by
     */
    public constructor(private readonly tableName: string, private readonly orderBy: string = "id") {
        super();
        verifyIsAllowedSqlIdent(tableName);
        verifyIsAllowedSqlIdent(orderBy);
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the result of the query
     * @returns the command which actually loads the node
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.resultIds = [];
        const commands: Map<string, LoadNodeListCommand<T>> = new Map();
        result.rows.forEach(row => {
            const id: string = row["id"];
            this.resultIds?.push(id);
            const tableName = row["relname"];
            const command: LoadNodeListCommand<T> = commands.get(tableName) ?? getLoadCommand(tableName, []) as LoadNodeListCommand<T>;
            command.ids?.push(id);
        });
        const commandsList = Array.from(commands.values());
        this.commands = commandsList;
        return commandsList;
    }

    /**
     * is called when all follow-up commands are executed
     * if something has to happen here, this method should be overwritten
     * @param databaseManager databaseManager used to add nodes
     * @param commands the list of follow-up commands
     */
    public notifyFollowUpCommandsResult(databaseManager: DatabaseManager, commands: DatabaseCommand<any>[]): void {
        const nodesMap: Map<string, T> = new Map();
        this.commands?.forEach(command => {
            command.getResult().forEach(node => {
                nodesMap.set(node.id, node);
            });
        });
        this.result = this.resultIds?.reduce((res, id) => {
            const node = nodesMap.get(id);
            if (node) {
                res.push(node);
            }
            return res;
        }, new Array<T>());
    }

    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT pg_class.relname FROM ${this.tableName} main INNER JOIN pg_class ON (node.tableoid = pg_class.oid) `,
            values: []
        }
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): {conditions: ConditionSpecification[], i: number} {
        const conditions: ConditionSpecification[] = [];

        if (this.ids) {
            if (this.ids.length == 1) {
                conditions.push({
                    priority: 1,
                    text: `main.id = $${i})`,
                    values: [this.ids[0]]
                });
            } else {
                conditions.push({
                    priority: 1,
                    text: `main.id = ANY($${i})`,
                    values: [this.ids]
                });
            }
            i++;
        }
        if (this.afterId) {
            conditions.push({
                priority: 2,
                text: `main.id > $${i}`,
                values: [this.afterId]
            });
            i++;
        }
        if (this.beforeId) {
            conditions.push({
                priority: 2,
                text: `main.id < $${i}`,
                values: [this.beforeId]
            });
            i++;
        }

        return {
            conditions: conditions, 
            i: i
        };
    }

    /**
     * generates the end of the query, for example a limit or a order
     * @param i the next index for a value in the query
     * @returns the end of the query
     */
    protected generateQueryEnd(i: number): QueryPart {
        if (this.limit) {
            return {
                text: `ORDER BY ${this.orderBy} ${this.first ? "ASC" : "DESC"} LIMIT $${i}`,
                values: [this.limit] 
            }
        } else {
            return {
                text: `ORDER BY ${this.orderBy}`,
                values: []
            }
        }
    }
    
}