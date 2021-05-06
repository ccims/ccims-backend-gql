import { SyncModifiable } from "./SyncModifiable";
import { SyncUpdate } from "./SyncUpdate";

/**
 * Container for a list of SyncModifiables
 * The apply function collects updates from all registered SyncModifiables and returns a flat array
 */
export class SyncModifiableContainer implements SyncModifiable {
    /**
     * Array with all SyncModifiables
     */
    private readonly _syncModifiables: SyncModifiable[] = [];

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