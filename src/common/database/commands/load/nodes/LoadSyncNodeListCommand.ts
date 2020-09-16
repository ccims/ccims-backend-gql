import { SyncNode } from "../../../../nodes/SyncNode";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * loads a list of syncNodes
 * @param T the type of SyncNode to load
 */
export abstract class LoadSyncNodeListCommand<T extends SyncNode> extends LoadNodeListCommand<T> {
    /**
     * if true, metadata is loaded
     */
    public loadWithMetadata: boolean = false;

    /**
     * gets a string with all rows that should be selected
     */
    protected get rows(): string {
        return this.loadWithMetadata ? super.rows + ", metadata" : super.rows;
    }
}