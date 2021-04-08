import { QueryConfig, QueryResult } from "pg";
import { DatabaseCommand } from "../../DatabaseCommand";
import { DatabaseManager } from "../../DatabaseManager";

/**
 * Command to set an entry of the sync lookup table
 */
export class SetSyncLookupTableEntryCommand extends DatabaseCommand<void> {

    /**
     * Creates a new SetSyncLookupTableEntryCommand
     * @param id the id used by the ims
     * @param imsComponentId the id of the ims
     * @param ccimsId the CCIMS internal id
     */
    public constructor(private readonly id: string, private readonly imsComponentId: string, private readonly ccimsId?: string) {
        super();
    }

    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "INSERT INTO sync_lookup_table (id, ims_component_id, ccims_id) VALUES ($1, $2, $3) ON CONFLICT DO UPDATE SET ccims_id = $3;",
            values: [
                this.id,
                this.imsComponentId,
                this.ccimsId
            ]
        };
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

}