import { SyncNode } from "../../../common/nodes/SyncNode";
import { SyncUpdate } from "../../SyncUpdate";
import { SyncValue } from "./SyncValue";

/**
 * Specification for a SyncListProperty
 * has functions which define how add and remove is applied to the SyncNode
 */
export interface SyncListPropertySpecification<T, V extends SyncNode> {
    /**
     * Is called to apply an added item to the node
     * @param item contains the item to be added
     * @param node the node which has the property to which the item is added
     * @returns a SyncUpdate which is used to sync the update the different IMS
     *          undefined if the update was not applied
     */
    applyAdd(item: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>;
    /**
     * Is called to apply a removed item to the node
     * @param item contains the item to be removed
     * @param node the node which has the property from which the item is removed
     * @returns a SyncUpdate which is used to sync the update the different IMS
     *          undefined if the update was not applied     */
    applyRemove(item: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>
}