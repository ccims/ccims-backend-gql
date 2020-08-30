import {CCIMSNode}  from "./CCIMSNode";
import {NodeType} from "./NodeType";
import {SyncMetadata} from "./SyncMetadata";

/**
 * 
 */
export abstract class SyncNode extends CCIMSNode {
    private _metadata: Map<string, SyncMetadata> | undefined;

    protected constructor(type: NodeType, id: string, isNew: boolean, isChanged: boolean, isDeleted: boolean, metadata?: Map<string, SyncMetadata>) {
            super(type, id, isNew, isChanged, isDeleted);
            this._metadata = metadata;
    }

    /**
     * returnes true if this SyncNode was created with metadata, otherwise false
     */
    get isMetadataPresent(): boolean {
        return this._metadata != undefined;
    }
 
    /**
     * Gets the metadata based on the specified id
     * @param id the id to look for metadata
     * @returns the found SyncMetadata or undefined, if no metadata was found for the specified IMSSystem id
     * @throws error if this node was created without metadata
     */
    public getMetadata(id: string): SyncMetadata | undefined {
        if (!this._metadata) {
            throw new Error("this SyncNode was loaded without metadata");
        }
        return this._metadata.get(id);
    }

    /**
     * Adds / replaces the metadata for metadata.id
     * @param metadata the metadata to set
     * @throws error if this node was created without metadata
     */
    public setMetadata(metadata: SyncMetadata): void {
        if (!this._metadata) {
            throw new Error("this SyncNode was loaded without metadata");
        }
        this._metadata.set(metadata.id, metadata);
    }

    /**
     * Removes the metadata associated with id
     * @param id  the id of the IMSSystem of which metadata should be removed
     * @throws error if this node was created without metadata
     */
    public removeMetadata(id: string): void {
        if (!this._metadata) {
            throw new Error("this SyncNode was loaded without metadata");
        }
        this._metadata.delete(id);
    }

}