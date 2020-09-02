import { NodeType } from "./NodeType";
import { DatabaseManager } from "../database/DatabaseManager";
import { DatabaseCommand } from "../database/DatabaseCommand";

/**
 * Base class for all datatypes with an id, which are accessable via the api
 */
export abstract class CCIMSNode {
    private _id: string;
    private _type: NodeType;
    private _isNew: boolean = false;
    private _isChanged: boolean = false;
    private _isDeleted: boolean = false;
    protected databaseManager: DatabaseManager;

    protected constructor (type: NodeType, databaseManager: DatabaseManager, id: string) {
        this._id = id;
        this._type = type;
        this.databaseManager = databaseManager;
    }

    /**
     * gets the unique id, which is used for the database
     * this is neither null nor empty
     */
    public get id(): string {
        return this._id;
    }

    /**
     * gets the type of this node
     * this is also used for the graphql resolvers
     */
    public get type(): NodeType {
        return this._type;
    }

    /**
     * returns true, if this node was modified or newly created
     */
    public isChanged(): boolean {
        return this._isChanged;
    }

    /**
     * returns true if this node was newly created
     */
    public isNew(): boolean {
        return this._isNew;
    }

    /**
     * returnes true if this node is deleted
     * this does not indicate that it was newly deleted
     */
    public isDeleted(): boolean {
        return this._isDeleted;
    }

    /**
     * marks this noda as new, and therefore also as changed
     */
    protected markNew(): void {
        this._isNew = true;
        this._isChanged = true;
    }

    /**
     * marks this node as changed, aka isChanged will return true
     */
    protected markChanged(): void {
        this._isChanged = true;
    }

    /**
     * marks this node as deleted
     * this also marks this node as changed
     */
    protected markDeleted(): void {
        this._isDeleted = true;
        this._isChanged = true;
    }

    /**
     * string equivalent of type for graphql resolvers
     */
    public get __typename(): string {
        return this._type;
    }

    /**
     * generates a DatabaseCommand which updates or inserts or deletes
     * the node
     */
    public abstract getSaveCommand(): DatabaseCommand<void>;
}