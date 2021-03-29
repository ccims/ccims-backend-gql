import { Component } from "../common/nodes/Component";
import { SyncManager } from "./SyncManager";

/**
 * Interface which defines a SyncAdapter
 * A SyncAdapter is a class which provides sync functionality for a specific IMS
 */
export interface SyncAdapter {
    /**
     * If true, the IMS can sync
     * should only return true, if it is likely that the sync can be completed
     */
    canSync(component: Component): Promise<boolean>;

    /**
     * Sync the underlaying component using the provided SyncManager
     * @param syncManager provides the component and other sync features
     */
    sync(syncManager: SyncManager): Promise<void>;
}