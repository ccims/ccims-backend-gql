import { SyncNode } from "../common/nodes/SyncNode";

/**
 * Represents an update caused by sync
 */
export interface SyncUpdate {
    /**
     * new SyncNodes created because of the update
     */
    newSyncNodes: SyncNode[],
    /**
     * updated SyncNodes
     */
    updatedSyncNodes: SyncNode[]
}