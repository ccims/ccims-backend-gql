import { QueryConfig, QueryResult } from "pg";
import { DatabaseCommand } from "../../DatabaseCommand";
import { DatabaseManager } from "../../DatabaseManager";

/**
 * Loads an entry from the SyncLookupTable
 */
export class LoadSyncLookupTableEntryCommand extends DatabaseCommand<string | undefined> {

    /**
     * Creates a new SetSyncLookupTableEntryCommand
     * @param id the id used by the ims
     * @param imsId the id of the ims
     */
    public constructor(private readonly id: string, private readonly imsId: string) {
        super();
    }

    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT (ccims_id) FROM sync_lookup_table WHERE id = $1 AND ims_id = $2",
            values: [
                this.id,
                this.imsId
            ]
        };
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows[0]?.ccims_id;
        return [];
    }

}