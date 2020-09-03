import { NodeType } from "./NodeType";
import { DatabaseManager } from "../database/DatabaseManager";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { Saveable } from "./Saveable";

/**
 * Base class for all datatypes with an id, which are accessable via the api
 */
export abstract class CCIMSNode implements Saveable {
    private _id: string;
    private _type: NodeType;
    private _isNew: boolean = false;
    private _isChanged: boolean = false;
    private _isDeleted: boolean = false;
    protected databaseManager: DatabaseManager;
    private _saveables: Saveable[] = [];

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
     * registers a saveable, so it is saved when necessary
     * @param saveable the Savable to add
     */
    protected registerSaveable(saveable: Saveable): Saveable {
        this._saveables.push(saveable);
        return saveable;
    }

    /**
     * saves this node
     * this should not be overwritten by child classes
     * @see getSaveCommandsInternal
     */
    public save(): void {
        this._saveables.forEach(saveable => saveable.save());
        if (this.isChanged()) {
            this.databaseManager.addCommand(this.getSaveCommandsInternal());
        }
    }

    /**
     * this should be overwritten to generate a save command
     * this method is only invoked if isChanged()
     */
    protected abstract getSaveCommandsInternal(): DatabaseCommand<any>;
}