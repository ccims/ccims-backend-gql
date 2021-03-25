import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncUpdate } from "../SyncUpdate";
import { SyncModifiable } from "./SyncModifiable";

/**
 * Wrapper class for SyncNodes to provide sync functionality
 * Use the provided properties to change the node, or use the underlying node to get the current state directly
 * The apply function can be called to apply all current changes
 */
export class SyncNodeContainer<T extends SyncNode> implements SyncModifiable {
    private readonly _node: T;

    /**
     * Array with all SyncModifiables
     */
    private readonly _syncModifiables: SyncModifiable[] = [];

    public constructor(node: T) {
        this._node = node;
    }

    public get node() {
        return this._node;
    }

    /**
     * Registers a sync modifiable
     * @param modifiable the modifiable to add to sync modifiables
     * @returns modifiable
     */
    protected registerSyncModifiable<V extends SyncModifiable>(modifiable: V) : V {
        this._syncModifiables.push(modifiable);
        return modifiable;
    }

    /**
     * Applies all updates to the underlying node
     * @returns updates from the apply
     */
    public async apply(): Promise<SyncUpdate[]> {
        const updates = await Promise.all(this._syncModifiables.map(modifiable => modifiable.apply()));
        return updates.flat();
    }
}