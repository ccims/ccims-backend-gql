import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadListCommand } from "../LoadListCommand";
import { QueryResultRow, QueryResult } from "pg";
import { ConditionSpecification } from "../ConditionSpecification";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { RowSpecification } from "../../../../nodes/NodeTableSpecification";
import { DatabaseCommand } from "../../../DatabaseCommand";
import { createStringListFilter } from "./RelationFilter";

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
     * if true, the pagination is not applied an the rows are just counted
     */
    public countMode: boolean = false;

    /**
     * when countMode and the command was executed, count is the amount of the amount of results
     */
    public count?: number;

    /**
     * true if forwards paginating and there are more results
     */
    public hasNext: boolean = false;

    /**
     * true if backwards paginating and there are more results
     */
    public hasPrevious: boolean = false;

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
        return this.countMode ? "Count(*)" : this._rows;
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = this.countMode ? {conditions: [], i} : this.generatePaginationConditions(i);

        if (this.ids) {
            conditions.conditions.push(createStringListFilter("id", this.ids, conditions.i, 1));
            conditions.i++;
        }

        return conditions;
    }

    /**
     * generates the conditions for pagination
     * only called when !this.countMode
     * @param i the next value index
     * @returns the conditions for pagination
     */
    protected generatePaginationConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions: ConditionSpecification[] = [];
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
        return {conditions, i};
    }

    /**
     * called when the query is finished
     * calls getSingleResult for every returned row
     * @param databaseManager the databaseManager
     * @param result the result from the query
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        if (!this.countMode) {
            const res = result.rows.map(resultRow => this.getSingleResult(databaseManager, resultRow, result));
            if (this.limit && res.length > this.limit) {
                if (this.first) {
                    this.hasNext = true;
                } else {
                    this.hasPrevious = true;
                }
                this.result = res.slice(0, this.limit);
            } else {
                this.result = res;
            }
            if (!this.first) {
                this.result = this.result.reverse();
            }
            return [];
        } else {
            this.count = Number.parseInt(result.rows[0].count);
            return [];
        }
    }

    /**
     * parses a single result from the query
     * @param databaseManager teh databaseManager to use
     * @param resultRow the result row from the query
     * @param result the complete result from the query
     * @returns the parsed element
     */
    protected getSingleResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T {
        const cacheResult = databaseManager.getCachedNode(resultRow.id);
        let returnValue: T;
        if (cacheResult) {
            returnValue = cacheResult as T;
        } else {
            const newNode: T = this.getNodeResult(databaseManager, resultRow, result);
            databaseManager.addCachedNode(newNode);
            returnValue = newNode;
        }
        return returnValue;
    }

    /**
     * must be overwritten to parse the result rows
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed node
     */
    protected abstract getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T;

    /**
     * generates the end of the query, for example a limit or a order
     * @param i the next index for a value in the query
     * @returns the end of the query
     */
    protected generateQueryEnd(i: number): QueryPart {
        if (this.limit && !this.countMode) {
            return {
                text: `ORDER BY main.id ${this.first ? "ASC" : "DESC"} LIMIT $${i};`,
                values: [this.limit + 1]
            }
        } else if (!this.countMode) {
            return {
                text: "ORDER BY main.id;",
                values: []
            }
        } else {
            return {
                text: ";",
                values: []
            }
        }
    }

}
