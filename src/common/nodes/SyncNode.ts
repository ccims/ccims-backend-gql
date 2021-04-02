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
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommandBase";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { Issue } from "./Issue";
import { SetMetadataCommand } from "../database/commands/save/SetMetadataCommand";

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
     * the loaded metadata
     * the DatabaseManager decides which metadata id is loaded
     * if undefined, the metadata is not loaded or not present
     */
    private _metadata?: SyncMetadata;

    private _metadataChanged: boolean = false;

    private readonly _lastModifiedAt: Date;

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
        );

    /**
     * Property getter to get the creator user object
     * @returns A promise of a user or `undefined` who created this sync node
     */
    public async createdBy(): Promise<User | undefined> {
        return this.createdByProperty.getPublic()
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
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id);
        this._metadata = metadata
        this._lastModifiedAt = lastModifiedAt;
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
     * If metadata is changed, setMetadata must be called
     * @returns the found SyncMetadata or undefined, if no metadata was found for the specified IMSSystem id
     * @throws error if this node was created without metadata
     */
    public get metadata(): SyncMetadata | undefined {
        if (this._databaseManager.metadataId === undefined) {
            throw new Error("this SyncNode was loaded without metadata");
        }
        return this._metadata;
    }

    /**
     * Adds / replaces the metadata for metadata.id
     * Note: has to be called if changes should be saved
     * @param metadata the metadata to set
     * @throws error if this node was created without metadata
     */
    public set metadata(metadata: SyncMetadata | undefined) {
        if (this._databaseManager.metadataId === undefined) {
            throw new Error("this SyncNode was loaded without metadata");
        }
        this.markChanged();
        this._metadataChanged = true;
        this._metadata = metadata;
    }

    /**
     * Get when the node was last modified
     * this value is not saved and maintained by the database
     */
    public get lastModifiedAt(): Date {
        return this._lastModifiedAt;
    }

    /**
     * this can be overwritten to generate a save command
     * this method is only invoked if isChanged()
     * adds the metadata
     */
    protected getSaveCommandsInternal(): DatabaseCommand<any> | undefined {
        const metadataCommand = this._metadataChanged ? [new SetMetadataCommand(this.id, this._databaseManager.metadataId!, this._metadata)] : [];
        if (this.isNew) {
            return new AddNodeCommand(this as any as T, this._tableSpecification.tableName, this._tableSpecification.rows, ...metadataCommand);
        } else {
            return new UpdateNodeCommand(this as any as T, this._tableSpecification.tableName, this._tableSpecification.rows, ...metadataCommand);
        }
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * For all immutable SyncNodes, this is just the creation data
     * all other SyncNodes have to overwrite this to implement correct functionality
     */
    public get lastEditedAt(): Date {
        return this._createdAt;
    }

}