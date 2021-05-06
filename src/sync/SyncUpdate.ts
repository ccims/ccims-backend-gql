import { SyncMetadata } from "../common/nodes/SyncMetadata";
import { SyncNode } from "../common/nodes/SyncNode";
import { log } from "../log";

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
    updatedSyncNodes?: SyncNode[]
}

/**
 * Creates a new SyncUpdate from a SyncNode
 * Also adds the specified metadata to the SyncNode if metadata is present
 * if the SyncNode is not present, a warning is logged
 */
export function fromNewNodeWithMetadata(node: SyncNode | undefined, metadata: SyncMetadata | undefined): SyncUpdate {
    if (node !== undefined) {
        if (metadata !== undefined) {
            node.metadata = metadata;
        }
        return {
            newSyncNodes: [node]
        };
    } else {
        log(3, `SyncUpdate: no new node provided, metadata: ${metadata}`);
        return {
            newSyncNodes: []
        };
    }
}