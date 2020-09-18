import { LoadCommand } from "./LoadCommand";
import { QueryResult, QueryResultRow } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { DatabaseCommand } from "../../DatabaseCommand";

/**
 * load command, which loads an array instead of a single element
 * @param T the type of the elements in the array
 */
export abstract class LoadListCommand<T> extends LoadCommand<T[]> {   
   
    /**
     * called when the query is finished
     * calls getSingleResult for every returned row
     * @param databaseManager the databaseManager
     * @param result the result from the query
     */
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