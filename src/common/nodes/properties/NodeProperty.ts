import { CCIMSNode } from "../CCIMSNode";
import { NodePropertyBase } from "./NodePropertyBase";
import { Property } from "./Property";
import { NodePropertySpecification } from "./NodePropertySpecification";
import { DatabaseManager } from "../../database/DatabaseManager";
import { log } from "../../../log";

/**
 * property which represents the one side on a many to one relation
 * does not support undefined other node
 * @param T the type of the other node
 * @param V the type of the node on which this property is
 */
export class NodeProperty<T extends CCIMSNode, V extends CCIMSNode> extends NodePropertyBase<T, V> implements Property<T> {

    /**
     * the specification of the property
     */
    private readonly _specification: NodePropertySpecification<T, V>;
    /**
     * the id of the other node
     */
    private _id: string;
    /**
     * the other node if already loaded
     */
    private _element?: T;

    /**
     * creates a new NodeProperty with the provided specification
     * @param id the id of the element this property is currently set to
     * @param databaseManager  the databaseManager used to execute DatabaseCommands
     * @param specification  the specification of this property
     * @param node the node which contains this property
     */
    public constructor(databaseManager: DatabaseManager, specification: NodePropertySpecification<T, V>, node: V, id: string) {
        super(databaseManager, specification, node);
        this._id = id;
        this._specification = specification;
    }

    /**
     * get the id or undefined if no property is set
     */
    public getId(): string {
        return this._id;
    }

    /**
     * get the current element
     */
    public async get(): Promise<T> {
        await this.ensureLoaded();
        return this._element as T;
    }

    /**
     * sets  the element of this property
     * @param value the element to set, this might be undefined
     */
    public async set(value: T): Promise<void> {
        if (this._id !== value.id) {
            await this.ensureLoaded();
            this._node.markChanged();
            if (this._element) {
                await this.notifyRemoved(this._element, false);
            }
            this._element = value;
            this._id = value.id;
            await this.notifyAdded(value, false);
        } else {
            this._element = value;
        }
    }

    /**
     * ensures that this property is loaded
     */
    private async ensureLoaded(): Promise<void> {
        if (!this._element && this._id) {
            const loadCommand = this._specification.loadFromId(this._id, this._node);
            this._databaseManager.addCommand(loadCommand);
            await this._databaseManager.executePendingCommands();
            const result = loadCommand.getResult();
            if (result.length > 0) {
                this._element = result[0];
            } else {
                const reloadCommand = this._specification.reload(this._node);
                this._databaseManager.addCommand(reloadCommand);
                await this._databaseManager.executePendingCommands();
                const reloadResult = reloadCommand.getResult();
                if (reloadResult) {
                    this._id = reloadResult.id;
                    this._element = reloadResult;
                    this.notifyAdded(this._element, false);
                } else if (this._specification.deletedId) {
                    const loadDeletedCommand = this._specification.loadFromId(this._specification.deletedId, this._node);
                    this._databaseManager.addCommand(loadDeletedCommand);
                    await this._databaseManager.executePendingCommands();
                    if (loadDeletedCommand.getResult().length === 0) {
                        log(2, "error: deleted command does not exist");
                        throw new Error("Internal server error");
                    }
                    this._id = this._specification.deletedId;
                    this._element = loadDeletedCommand.getResult()[0];
                    this.notifyAdded(this._element, false);
                } else {
                    log(3, `self destruct ${this._node.id}`);
                    await this._node.markDeleted();
                    throw new Error("Internal server error");
                }
            }
        }
    }

    /**
     * notifies the element that this node was added
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    async wasAddedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        if (!byDatabaseUpdate && element.id !== this._id) {
            this._node.markChanged();
        }
        this._element = element;
        this._id = element.id;
    }

    /**
     * notifies the element that this node was removed
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    async wasRemovedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        // this can only be a temporary state, so just ignore it
    }

    /**
     * called to save the property
     * does nothing on the one side
     */
    save(): void {
        // do nothing,
    }

}