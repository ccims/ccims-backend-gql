import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncModifiableContainer } from "../SyncModifiableContainer";

/**
 * Wrapper class for SyncNodes to provide sync functionality
 * Use the provided properties to change the node, or use the underlying node to get the current state directly
 * The apply function can be called to apply all current changes
 */
export class SyncNodeWrapper<T extends SyncNode> extends SyncModifiableContainer {
    private readonly _node: T;

    public constructor(node: T) {
        super();
        this._node = node;
    }

    public get node() {
        return this._node;
    }


}