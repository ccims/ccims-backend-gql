import { LoadCommand } from "./LoadCommand";
import { NodeCache } from "../../NodeCache";
import { QueryResult, QueryResultRow } from "pg";

export abstract class LoadListCommand<T> extends LoadCommand<T[]> {   
    protected getResultInternal(nodeCache: NodeCache, result: QueryResult): T[] {
        return result.rows.map(resultRow => this.getSingleResult(nodeCache, resultRow, result));
    }

    /**
     * must be overwritten to generate the result foreach row
     * @param nodeCache  NodeCache to get and add CCIMSNodes
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed element
     */
    protected abstract getSingleResult(nodeCache: NodeCache, resultRow: QueryResultRow, result: QueryResult): T;
}