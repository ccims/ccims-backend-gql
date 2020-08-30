import {CCIMSNode}  from "./CCIMSNode";
import {NodeType} from "./NodeType";
import {SyncMetadata} from "./SyncMetadata";

export abstract class SyncNode extends CCIMSNode {
    private _metadata: Map<string, SyncMetadata> | undefined;

    protected constructor(type: NodeType, id: string, isNew: boolean, isChanged: boolean, isDeleted: boolean, metadata?: Map<string, SyncMetadata>) {
            super(type, id, isNew, isChanged, isDeleted);
            this._metadata = metadata;
    }
}