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
     *          undefined if the update was not applied
     */
    applyRemove(item: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>;
    /**
     * Is called to apply an added item to the node, however it is only applied as a historic event:
     * The current status isn't changed, however a timeline entry may be creatd
     * @param item contains the item to be added
     * @param node the node which has the property to which the item is added
     * @returns a SyncUpdate which is used to sync the update the different IMS
     *          undefined if the update was not applied
     */
    applyAddHistoric(item: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>;
    /**
     * Is called to apply a removed item to the node, however it is only applied as a historic event:
     * The current status isn't changed, however a timeline entry may be creatd
     * @param item contains the item to be removed
     * @param node the node which has the property to which the item is removed
     * @returns a SyncUpdate which is used to sync the update the different IMS
     *          undefined if the update was not applied
     */
    applyRemoveHistoric(item: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>;
    /**
     * Gets the current status of a specific item
     * currentStatus is true if the property contains the speified element
     * lastUpdatedAt exists if it was ever updated (and if so, it contains the date of that update)
     * @param item the item for which the current status should be queried
     */
    getCurrentStatus(item: T): Promise<{ currentStatus: boolean, lastUpdatedAt?: Date}>
}