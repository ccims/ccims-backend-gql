import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadListCommand } from "../LoadListCommand";
import { QueryResultRow, QueryResult } from "pg";
import { ConditionSpecification } from "../ConditionSpecification";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { RowSpecification } from "../../../../nodes/NodeTableSpecification";

/**
 * loads a list of nodes
 * @param T the type of CCISNode to query
 */
export abstract class LoadNodeListCommand<T extends CCIMSNode> extends LoadListCommand<T> {
    
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
     * string with all rows that shoule be queried
     */
    private _rows: string;

    protected constructor(rows: RowSpecification<T>[]) {
        super();
        this._rows = rows.map(row => row.rowName).join(", ");
    }

    /**
     * @return a string with all rows that should be selected separated by ,
     */
    protected get rows(): string {
        return this._rows;
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @return the array of conditions and a index for the next value
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
     * parses a single result from the query
     * @param databaseManager teh databaseManager to use
     * @param resultRow the result row from the query
     * @param result the complete result from the query
     */
    protected getSingleResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T {
        const cacheResult = databaseManager.getCachedNode(resultRow["id"]);
        if (cacheResult) {
            return cacheResult as T;
        } else {
            const newNode: T = this.getNodeResult(databaseManager, resultRow, result);
            databaseManager.addCachedNode(newNode);
            return newNode;
        }
    }

    /**
     * must be overwritten to parse the result rows
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed element
     */
    protected abstract getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T;

    /**
     * generates the end of the query, for example a limit or a order
     * @param i the next index for a value in the query
     */
    protected generateQueryEnd(i: number): QueryPart {
        if (this.limit) {
            return {
                text: `ORDER BY main.id ${this.first ? "ASC" : "DESC"} LIMIT $${i}`,
                values: [this.limit] 
            }
        } else {
            return {
                text: "ORDER BY main.id",
                values: []
            }
        }
    }

}
