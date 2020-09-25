import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { NodeType } from "./NodeType";
import { SyncMetadata } from "./SyncMetadata";
import { DatabaseManager } from "../database/DatabaseManager";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { AddNodeCommand } from "../database/commands/save/AddNodeCommands";
import { UpdateNodeCommand } from "../database/commands/save/UpdateNodeCommand";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { User } from "./User";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { Issue } from "./Issue";
import { DeletedNodes } from "./DeletedNodes";

/**
 * a table specification for a sync node
 * does not specifiy the metadata, because this is up to the save method
 */
export const SyncNodeTableSpecification: NodeTableSpecification<SyncNode>
    = new NodeTableSpecification<SyncNode>("syncNode", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("deleted", "isDeleted"),
        new RowSpecification("created_by", (syncNode => syncNode.createdByProperty.getId())),
        RowSpecification.fromProperty("created_at", "createdAt")
    );

/**
 * a syncNode
 * @param T the type of the SyncNode
 */
export abstract class SyncNode<T extends SyncNode = any> extends CCIMSNode {
    /**
     * map with metadata
     * if undefined, the metadata is just not loaded, it may be present in the database
     */
    private _metadata: Map<string, SyncMetadata> | undefined;

    public createdByProperty: NullableNodeProperty<User, SyncNode>;

    /**
     * has no notifier because a user does NOT know which SyncNodes he created
     */
    private static createdByPropertySpecification: NodePropertySpecification<User, SyncNode>
        = new NodePropertySpecification<User, SyncNode>(
            (id, syncNode) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            syncNode => new GetWithReloadCommand(syncNode, "created_by", new LoadUsersCommand()),
            DeletedNodes.User
        );

    /**
     * Property getter to get the creator user object
     * @returns A promise of a user or `undefined` who created this sync node
     */
    public async createdBy(): Promise<User | undefined> {
        return this.createdByProperty.get()
    }

    private readonly _createdAt: Date;

    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(type, databaseManager, tableSpecification, id);
        if (metadata) {
            this._metadata = new Map(metadata.entries);
        }
        this._isDeleted = isDeleted;
        this._createdAt = createdAt;
        this.createdByProperty = new NullableNodeProperty<User, SyncNode>(databaseManager, SyncNode.createdByPropertySpecification, this, createdById);
    }

    /**
     * returnes true if this SyncNode was created with metadata, otherwise false
     */
    public get isMetadataPresent(): boolean {
        return this._metadata !== undefined;
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
        this.markChanged();
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
        this.markChanged();
        this._metadata.delete(id);
    }

    /**
     * this can be overwritten to generate a save command
     * this method is only invoked if isChanged()
     * adds the metadata
     */
    protected getSaveCommandsInternal(): DatabaseCommand<any> | undefined {
        if (this.isNew) {
            return new AddNodeCommand(this as any as T, this._tableSpecification.tableName, [...this._tableSpecification.rows, new RowSpecification("metadata", node => { entries: [...node._metadata ?? []] })]);
        } else if (this._metadata) {
            return new UpdateNodeCommand(this as any as T, this._tableSpecification.tableName, [...this._tableSpecification.rows, new RowSpecification("metadata", node => { entries: [...node._metadata ?? []] })]);
        } else {
            return new UpdateNodeCommand(this as any as T, this._tableSpecification.tableName, this._tableSpecification.rows);
        }
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

}

/**
 * interface for the json format of the metadata
 */
export interface SyncMetadataMap {
    entries: [string, SyncMetadata][]
}