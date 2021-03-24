import { SyncUpdate } from "../../SyncUpdate";

export interface SyncPropertyBase {
    /**
     * Applies all updates to the underlying node
     * @returns updates from the apply
     */
    apply(): Promise<SyncUpdate[]>;
}