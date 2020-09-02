import { QueryConfig, QueryResult } from "pg";
import { NodeCache } from "./NodeCache";

/**
 * @param T the type for the result of the Command
 */
export abstract class DatabaseCommand<T> {

    /**
     *subCommands which are executed with this DatabaseCommand
     */
    public subCommands: DatabaseCommand<any>[] = [];

    /**
     * the result when the query was executed
     * this MUST only be used by getResultInternal (read access)
     * and the DatabaseManager (write access)
     */
    databaseResult?: QueryResult;

    private result?: T;

    /**
     * overrite this method to generate the query
     */
    public abstract getQueryConfig(): QueryConfig; 

    /**
     * gets the result of this query as soon as it is available
     * this method caches the result automatically
     * @param nodeCache nodeCache used to get / add nodes
     * @throws error if databaseResult is not present
     */
    public getResult(nodeCache: NodeCache): T {
        if (!this.result) {
            if (!this.databaseResult) {
                throw new Error("no database result available");
            }
            this.result = this.getResultInternal(nodeCache, this.databaseResult);
        }
        return this.result;
    }

    /**
     * must be overwritten by subclasses
     * used by @see getResult to generate the result out of the databaseResult
     * it is guaranteed that databaseResult is NOT undefined
     * @param nodeCache nodeCache used to get / add nodes
     */
    protected abstract getResultInternal(nodeCache: NodeCache, result: QueryResult): T

}