import { SyncMetadata } from "../../common/nodes/SyncMetadata";
import { User } from "../../common/nodes/User";

export interface SyncValue<T> {
    /**
     * the value
     */
    value: T,
    /**
     * the user who set the value
     */
    asUser?: User,
    /**
     * the date when the value was set
     */
    atDate?: Date,
    /**
     * Metadata which is applied to all new SyncNodes
     */
    metadata?: SyncMetadata
}