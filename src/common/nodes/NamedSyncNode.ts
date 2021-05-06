import { DatabaseManager } from "../database/DatabaseManager";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { SyncMetadata } from "./SyncMetadata";
import { SyncNode, SyncNodeTableSpecification } from "./SyncNode";

/**
 * specification of a table which can contain NamedSyncNodes
 */
export const NamedSyncNodeTableSpecification: NodeTableSpecification<NamedSyncNode>
    = new NodeTableSpecification<NamedSyncNode>("node", SyncNodeTableSpecification,
        RowSpecification.fromProperty("name", "name"),
        RowSpecification.fromProperty("description", "description"),
        RowSpecification.fromProperty("last_updated_at", "lastUpdatedAt"));

/**
 * a namedSyncNode is a CCIMSNode with a name and a description
 * @param T the type of this NamedSyncNode
 */
export class NamedSyncNode<T extends NamedSyncNode = any> extends SyncNode<T> {
    /**
     * the name, a string shorter than 257 chars
     */
    private _name: string;

    /**
     * the description, a string shorter than 65537 chars
     */
    private _description: string;

    /**
     * the date when the NamedNode was last updated (name or description changed)
     */
    private _lastUpdatedAt: Date;

    /**
     * abstract constructor for subclasses
     * @param type the type
     * @param databaseManager the databaseManager
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, name: string, description: string, lastUpdatedAt: Date,
        createdById: string | undefined, createdAt: Date, isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this._name = name;
        this._description = description;
        this._lastUpdatedAt = lastUpdatedAt;
    }

    public get name(): string {
        return this._name;
    }

    /**
     * sets the name, which must shorter than 257 chars
     */
    public setName(value: string, atDate: Date) {
        if (value.length > 256) {
            throw new Error("the specified name is too long");
        }
        this.markChanged();
        this.lastUpdatedAt = atDate;
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }

    /**
     * sets the name, which must shorter than 65537 chars
     */
    public setDescription(value: string, atDate: Date) {
        if (value.length > 65536) {
            throw new Error("the specified description is too long");
        }
        this.markChanged();
        this.lastUpdatedAt = atDate;
        this._description = value;
    }

    /**
     * For all immutable SyncNodes, this is just the creation data
     * all other SyncNodes have to overwrite this to implement correct functionality
     */
    public get lastUpdatedAt(): Date {
        return this._lastUpdatedAt;
    }

    /**
     * Sets lastUpdatedAt if the provided value is greater than the current value
     */
    public set lastUpdatedAt(value: Date) {
        if (this._lastUpdatedAt.getTime() < value.getTime()) {
            this._lastUpdatedAt = value;
            this.markChanged();
        }
    }
}