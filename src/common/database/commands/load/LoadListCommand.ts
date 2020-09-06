import { LoadCommand } from "./LoadCommand";
import { NodeCache } from "../../NodeCache";
import { QueryResult, QueryResultRow } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { DatabaseCommand } from "../../DatabaseCommand";

export abstract class LoadListCommand<T> extends LoadCommand<T[]> {   
   
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result =  result.rows.map(resultRow => this.getSingleResult(databaseManager, resultRow, result));
        return [];
    }

    /**
     * must be overwritten to generate the result foreach row
     * @param databaseManager databaseManager used to add nodes
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed element
     */
    protected abstract getSingleResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult): T;
}