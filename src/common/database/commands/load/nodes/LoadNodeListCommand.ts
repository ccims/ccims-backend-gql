import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadListCommand } from "../LoadListCommand";
import { NodeCache } from "../../../NodeCache";
import { QueryResultRow, QueryResult } from "pg";
import { ConditionSpecification } from "../ConditionSpecification";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";

export abstract class LoadNodeListCommand<T extends CCIMSNode> extends LoadListCommand<T> {
    
    /**
     * filter by a list of ids
     * the priority for this filter is 1
     */
    public ids?: string[]

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): [ConditionSpecification[], number] {
        return this.ids ? [[{
            priority: 1,
            text: `main.id = ANY($${i})`,
            values: [this.ids]
        }], i + 1] : [[], i];
    }

    
    protected getSingleResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): T {
        const cacheResult = databaseManager.getNode(resultRow["id"]);
        if (cacheResult) {
            return cacheResult as T;
        } else {
            const newNode: T = this.getNodeResult(databaseManager, resultRow, result);
            databaseManager.addNode(newNode);
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

    protected generateQueryEnd(i: number): QueryPart {
        return {
            text: "ORDER BY main.id;",
            values: [] 
        }
    }

}