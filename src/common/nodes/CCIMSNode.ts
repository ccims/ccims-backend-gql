import { NodeType } from "./NodeType";
import { DatabaseManager } from "../database/DatabaseManager";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { Saveable } from "./Saveable";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { DeleteNodeCommand } from "../database/commands/DeleteNodeCommand";
import { AddNodeCommand } from "../database/commands/save/AddNodeCommands";
import { UpdateNodeCommand } from "../database/commands/save/UpdateNodeCommand";

/**
 * base specification of a table for a CCIMSNode
 */
export const CCIMSNodeTableSpecification: NodeTableSpecification<CCIMSNode>
    = new NodeTableSpecification<CCIMSNode>("node", undefined, RowSpecification.fromProperty("id", "id"));

/**
 * Base class for all datatypes with an id, which are accessable via the api
 */
export abstract class CCIMSNode<T extends CCIMSNode = any> extends Saveable {
    /**
     * the id of the node
     */
    private _id: string;
    /**
     * the type of the node
     */
    private _type: NodeType;
    /**
     * true if the node is new
     */
    private _isNew: boolean = false;

    /**
     * true if the node is removed
     */
    protected _isDeleted: boolean = false;

    /**
     * the specification of the table in which this node is saved
     */
    public readonly _tableSpecification: NodeTableSpecification<T>;


    /**
     * creates a new CCIMSNode
     * for inherited classed
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification teh specification of the table
     * @param id the id of this node
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string) {
        super(databaseManager);
        this._id = id;
        this._type = type;
        this._tableSpecification = tableSpecification;
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
     * returns true if this node was newly created
     */
    public get isNew(): boolean {
        return this._isNew;
    }

    /**
     * returnes true if this node is deleted
     * this does not indicate that it was newly deleted
     */
    public get isDeleted(): boolean {
        return this._isDeleted;
    }

    /**
     * marks this noda as new, and therefore also as changed
     */
    protected markNew(): void {
        this._isNew = true;
        this.markChanged();
    }

    /**
     * marks this node as deleted
     * this also marks this node as changed
     */
    public async markDeleted(): Promise<void> {
        this._isDeleted = true;
        this.markChanged();
    }

    /**
     * string equivalent of type for graphql resolvers
     */
    public get __typename(): string {
        return this._type;
    }

    /**
     * saves this node
     * this should not be overwritten by child classes
     * @see getSaveCommandsInternal
     */
    public save(): void {
        super.save();
        if (this.isChanged) {
            const command = this.getSaveCommandsInternal();
            if (command) {
                this._databaseManager.addCommand(command);
            }
        }
    }

    /**
     * this can be overwritten to generate a save command
     * this method is only invoked if isChanged()
     */
    protected getSaveCommandsInternal(): DatabaseCommand<any> | undefined {
        if (this.isNew) {
            if (!this.isDeleted) {
                return new AddNodeCommand(this as any as T, this._tableSpecification.tableName, this._tableSpecification.rows);
            } else {
                return undefined
            }
        } else if (this.isDeleted) {
            return new DeleteNodeCommand(this.id, this._tableSpecification.tableName);
        } else {
            return new UpdateNodeCommand(this as any as T, this._tableSpecification.tableName, this._tableSpecification.rows)
        }
    }
}
