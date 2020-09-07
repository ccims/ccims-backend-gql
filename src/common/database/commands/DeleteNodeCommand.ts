import { DatabaseCommand } from "../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../DatabaseManager";

export class DeleteNodeCommand extends DatabaseCommand<void> {

    public constructor(private readonly id: string, private readonly table: string) {
        super();
    }

    public getQueryConfig(): QueryConfig<any[]> {
        return {
            text: `DELETE FROM ${this.table} WHERE id=$1`,
            values: [this.id]
        };
    }
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

}