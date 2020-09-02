import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadListCommand } from "../LoadListCommand";
import { NodeCache } from "../../../NodeCache";
import { QueryResultRow, QueryResult } from "pg";
import { QueryPart } from "../QueryPart";
import { ConditionSpecification } from "../ConditionSpecification";

export abstract class NodeListQuery<T extends CCIMSNode> extends LoadListCommand<T> {
    
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
    protected generateConditions(i: number): ConditionSpecification[] {
        return [{
            priority: 1,
            text: `main.id = ANY($${i})`,
            values: [this.ids]
        }]
    }

    /**
     * @see getNodeResult
     */
    protected getSingleResult(nodeCache: NodeCache, resultRow: QueryResultRow, result: QueryResult<any>): T {
        const cacheResult = nodeCache.getNode(resultRow["id"]);
        if (cacheResult) {
            return cacheResult as T;
        } else {
            const newNode: T = this.getNodeResult(resultRow, result);
            nodeCache.addNode(newNode);
            return newNode;
        }
    }

    /**
     * must be overwritten to parse the result rows
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed element
     */
    protected abstract getNodeResult(resultRow: QueryResultRow, result: QueryResult<any>): T;

}