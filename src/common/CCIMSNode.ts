import { NodeType } from "./NodeType";

/**
 * Base class for all datatypes with an id, which are accessable via the api
 */
export class CCIMSNode {
    private _id: string;
    private _type: NodeType;
    private _isNew: boolean;
    private _isChanged: boolean;
    private _isDeleted: boolean;

    constructor (type: NodeType, id: string) {
        this._id = id;
        this._type = type;
        this._isNew = true;
        this._isChanged = true;
        this._isDeleted = false;
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
     * marks this node as changed, aka isChanged will return true
     */
    protected markChanged(): void {
        this._isChanged = true;
    }

    /**
     * marks theis node as not changed and not new
     * WARNING: this should only be used by the database manager, calling
     * this everywhere else, especially after creating new node will result in serious
     * errors
     * This MUST NOT be used to mark this node as deleted
     */
    protected markLoadedFromDatabase(isDeleted: boolean): void {
        this._isChanged = false;
        this._isNew = false;
        this._isDeleted = isDeleted;
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
}