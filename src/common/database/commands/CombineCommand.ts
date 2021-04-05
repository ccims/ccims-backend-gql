import { QueryConfig, QueryResult } from "pg";
import { DatabaseCommand } from "../DatabaseCommand";
import { DatabaseManager } from "../DatabaseManager";

export class CombineCommand<T, R extends DatabaseCommand<T[]>> extends DatabaseCommand<T[]> {

    private primaryResult?: DatabaseCommand<any>[];

    public constructor(protected readonly commands: R[]) {
        super();
    }

    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return this.commands[0].getQueryConfig(databaseManager);
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.primaryResult = this.commands[0].setDatabaseResult(databaseManager, result);
        return [...this.primaryResult, ...this.commands.slice(1, this.commands.length)];
    }

    /**
     * is called when all follow-up commands are executed
     * if something has to happen here, this method should be overwritten
     * @param databaseManager databaseManager used to add nodes
     * @param commands the list of follow-up commands
     */
    public notifyFollowUpCommandsResult(databaseManager: DatabaseManager, commands: DatabaseCommand<any>[]): void {
        this.commands[0].notifyFollowUpCommandsResult(databaseManager, this.primaryResult as DatabaseCommand<any>[]);
        this.result = this.commands.flatMap(command => command.getResult());
    }

}