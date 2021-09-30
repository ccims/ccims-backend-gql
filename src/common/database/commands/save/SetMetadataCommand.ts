import { QueryConfig, QueryResult } from "pg";
import { SyncMetadata } from "../../../nodes/SyncMetadata";
import { DatabaseCommand } from "../../DatabaseCommand";
import { DatabaseManager } from "../../DatabaseManager";

/**
 * Command to set the metadata for a (sync) node
 */
export class SetMetadataCommand extends DatabaseCommand<void> {

    /**
     * Creates a new SetMetadataCommand
     * @param nodeId the id of the associated node
     * @param id the id the metadata is associated with (in most cases the IMS id)
     * @param metadata the metadata to set, might be undefined
     */
    public constructor(private readonly nodeId: string, private readonly id: string, private readonly metadata?: SyncMetadata) {
        super();
    }

    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "INSERT INTO metadata (node_id, id, metadata) VALUES ($1, $2, $3) ON CONFLICT (node_id, id) DO UPDATE SET metadata = $3;",
            values: [
                this.nodeId,
                this.id,
                this.metadata
            ]
        };
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

}