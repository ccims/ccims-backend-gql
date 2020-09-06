import { QueryConfig, QueryResult } from "pg";
import { NodeCache } from "./NodeCache";
import { DatabaseManager } from "./DatabaseManager";

/**
 * @param T the type for the result of the Command
 */
export abstract class DatabaseCommand<T> {

    /**
     *subCommands which are executed with this DatabaseCommand
     */
    public subCommands: DatabaseCommand<any>[] = [];

    protected result?: T;

    /**
     * overrite this method to generate the query
     */
    public abstract getQueryConfig(): QueryConfig; 

    /**
     * must be overwritten by subclasses
     * used by @see getResult to generate the result out of the databaseResult
     * it is guaranteed that databaseResult is NOT undefined
     * @param databaseManager used to add nodes
     * @returns is executed directly after, this can be used to execute necessary follow-up commands
     */
    public abstract setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult): DatabaseCommand<any>[];

    /**
     * is called when all follow-up commands are executed
     * if something has to happen here, this method should be overwritten
     * @param databaseManager databaseManager used to add nodes
     * @param commands the list of follow-up commands
     */
    public notifyFollowUpCommandsResult(databaseManager: DatabaseManager, commands: DatabaseCommand<any>[]): void {

    }

    /**
     * gets the result of this query as soon as it is available
     * this method caches the result automatically
     * this can be overwritten to change the behaviour
     * @throws error if no result is set, if this behaviour is unwanted, it is necessary to overwrite this method
     */
    public getResult(): T {
        if (!this.result) {
            throw new Error("no result currently set");
        }
        return this.result;
    }
}