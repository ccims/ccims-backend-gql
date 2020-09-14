import { SyncNode } from "../../../../nodes/SyncNode";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export abstract class LoadSyncNodeListCommand<T extends SyncNode> extends LoadNodeListCommand<T> {
    public loadWithMetadata: boolean = false;

    /**
     * gets a string with all rows that should be selected
     */
    protected get rows(): string {
        return this.loadWithMetadata ? super.rows + ", metadata" : super.rows;
    }
}