import { SyncNode } from "../../common/nodes/SyncNode";

export class SyncNodeContainer<T extends SyncNode> {
    private readonly _node: T;

    public constructor(node: T) {
        this._node = node;
    }

    public get node() {
        return this._node;
    }
}