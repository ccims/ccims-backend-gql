import { QueryResult, QueryResultRow } from "pg";
import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { RowSpecification } from "../../../../nodes/NodeTableSpecification";
import { DatabaseCommand } from "../../../DatabaseCommand";
import { DatabaseManager } from "../../../DatabaseManager";
import { verifyIsAllowedSqlIdent } from "../../SqlHelperFunctions";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a single node
 */
export class LoadMultipleNodeListsCommand<T extends CCIMSNode> extends LoadNodeListCommand<T> {

    /**
     * list of result ids
     */
    private resultIds: string[] | undefined;

    /**
     * list of follow up commands
     */
    private commands: LoadNodeListCommand<T>[] | undefined;

    /**
     * creates a command to load a node
     * @param tableName the name of the super table which contains all nodes
     */
    public constructor(protected readonly tableName: string) {
        super([RowSpecification.fromProperty("id", "id")]);
        verifyIsAllowedSqlIdent(tableName);
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the result of the query
     * @returns the command which actually loads the node
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        if (!this.countMode) {
            this.resultIds = [];
            const commands: Map<string, LoadNodeListCommand<T>> = new Map();
            result.rows.forEach(row => {
                const id: string = row.id;
                this.resultIds?.push(id);
                const tableName = row.relname;
                const command: LoadNodeListCommand<T> = commands.get(tableName) ?? this.getLoadCommand(tableName);
                command.ids?.push(id);
                commands.set(id, command);
            });
            const commandsList = Array.from(commands.values());
            this.commands = commandsList;
            return commandsList;
        } else {
            return super.setDatabaseResult(databaseManager, result);
        }
    }

    protected getLoadCommand(tableName: string): LoadNodeListCommand<T> {
        return require("./LoadFromIdsCommand").getLoadCommand(tableName, []) as LoadNodeListCommand<T>;
    }

    /**
     * is called when all follow-up commands are executed
     * if something has to happen here, this method should be overwritten
     * @param databaseManager databaseManager used to add nodes
     * @param commands the list of follow-up commands
     */
    public notifyFollowUpCommandsResult(databaseManager: DatabaseManager, commands: DatabaseCommand<any>[]): void {
        if (!this.countMode) {
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
            if (!this.first) {
                this.result = this.result?.reverse();
            }
        } else {
            super.notifyFollowUpCommandsResult(databaseManager, commands);
        }
    }

    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        if (this.countMode) {
            return {
                text: `SELECT ${this.rows(databaseManager)} FROM ${this.tableName} main INNER JOIN pg_class ON (main.tableoid = pg_class.oid) `,
                values: []
            }
        } else {
            return {
                text: `SELECT ${this.rows(databaseManager)}, pg_class.relname FROM ${this.tableName} main INNER JOIN pg_class ON (main.tableoid = pg_class.oid) `,
                values: []
            }
        }
    }

    protected getSingleResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T {
        throw new Error("forbidden");
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T {
        throw new Error("forbidden");
    }

}