import { ImsSystem } from "../../../common/nodes/ImsSystem";
import { SyncUpdate } from "../../SyncUpdate";

export interface SyncPropertyBase {
    /**
     * Applies all updates to the underlying node
     */
    apply(): void;
    /**
     * Gets all updates that have to be applied to the specified ims
     * @param ims the IMS on which the updates have to be applied
     * @returns all updates that should be applied on the specified IMS
     */
    getUpdates(ims: ImsSystem): SyncUpdate[]
}