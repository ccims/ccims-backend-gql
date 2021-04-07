import { GitHubAdapter } from "./github/GitHubAdapter";
import { SyncAdapter } from "./SyncAdapter";

/**
 * Singleton to manage SyncAdapters
 */
class SyncAdapters {

    /**
     * Map with all SyncAdapters, by tag
     */
    private _adaptersMap: Map<string, number> = new Map();

    /**
     * Creates a new SyncAdapters
     * additional adapters can be added later without breaking the api or database
     * @param syncAdapters the array of SyncAdapters, order MUST be maintained
     */
    public constructor(public readonly syncAdapters: SyncAdapter[]) {
        for (let i = 0; i < syncAdapters.length; i++) {
            this._adaptersMap.set(syncAdapters[i].tag, i);
        }
    }

    /**
     * Gets a SyncAdapter by tag
     * Throws an exception if such an adapter does not exist
     * @param tag the tag of the adapter
     * @returns the found adapter
     */
    public adapterByTag(tag: string): SyncAdapter {
        return this.syncAdapters[this.adapterIdByTag(tag)];
    }

    /**
     * Gets a SyncAdapter by id
     * Throws an exception if such an adapter does not exist
     * @param tag the tag of the adapter
     * @returns the found adapter
     */
    public adapterById(id: number): SyncAdapter {
        const adapter = this.syncAdapters[id];
        if (adapter == undefined) {
            throw new Error("Adapter with provided id does not exist");
        }

        return adapter;
    }

    /**
     * Gets the id of a SyncAdapter by tag
     * Throws an exception if such an adapter does not exist
     * @param tag the tag of the adapter
     * @returns the id of the found adapter
     */
    public adapterIdByTag(tag: string): number {
        const adapterId = this._adaptersMap.get(tag);
        if (adapterId == undefined) {
            throw new Error("Adapter with provided tag does not exist");
        }
        return adapterId;
    }
}

/**
 * The currently existing SyncAdapters
 */
export const Adapters = new SyncAdapters([GitHubAdapter]); 