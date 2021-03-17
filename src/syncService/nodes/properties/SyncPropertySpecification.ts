import { SyncNode } from "../../../common/nodes/SyncNode";
import { SyncUpdate } from "../../SyncUpdate";
import { SyncValue } from "./SyncValue";

/**
 * Specification for a SyncProperty
 * has a function which defines how a changed value is applied to the node
 */
export interface SyncPropertySpecification<T, V extends SyncNode> {
    /**
     * called to apply the changed value to the property of the node
     * @param value contains the new value for the property
     * @param node the node which has the property to which the value is applied
     * @returns a SyncUpdate which is used to sync the update the different IMS
     *          undefined if the update was not applied     
     */
    applyChange(value: SyncValue<T>, node: V): Promise<SyncUpdate | undefined>
}