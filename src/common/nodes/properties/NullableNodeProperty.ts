import { CCIMSNode } from "../CCIMSNode";
import { Property } from "./Property";
import { Saveable } from "../Saveable";
import { NodePropertySpecification } from "./NodePropertySpecification";
import { DatabaseManager } from "../../database/DatabaseManager";
import { NodePropertyBase } from "./NodePropertyBase";
import { log } from "../../../log";

/**
 * @see NodeProperty, but supports undefined for the other node
 */
export class NullableNodeProperty<T extends CCIMSNode, V extends CCIMSNode> extends NodePropertyBase<T, V> implements Saveable, Property<T> {

    /**
     * the specification of this property
     */
    private readonly _specification: NodePropertySpecification<T, V>;
    /**
     * if present, the id of the other node
     */
    private _id?: string;
    /**
     * the other node
     */
    private _element?: T;

    /**
     * creates a new nullable node property with the provided specification
     * @param id the id of the element this property is currently set to
     * @param databaseManager  the databaseManager used to execute DatabaseCommands
     * @param specification  the specification of this property
     * @param node the node which contains this property
     */
    public constructor(databaseManager: DatabaseManager, specification: NodePropertySpecification<T, V>, node: V, id?: string) {
        super(databaseManager, specification, node);
        this._id = id;
        this._specification = specification;
    }

    /**
     * get the id or undefined if no property is set
     */
    public getId(): string | undefined {
        return this._id;
    }

    /**
     * get the current element
     */
    public async get(): Promise<T | undefined> {
        await this.ensureLoaded();
        return this._element;
    }

    /**
     * sets (or removes) the element of this property
     * @param value the element to set, this might be undefined
     */
    public async set(value: T | undefined): Promise<void> {
        if (this._id !== value?.id) {
            await this.ensureLoaded();
            this._node.markChanged();
            if (this._element) {
                await this.notifyRemoved(this._element, false);
            }
        }
        if (value) {
            if (value.id === this._id) {
                this._element = value;
            } else {
                this._element = value;
                this._id = value.id;
                await this.notifyAdded(value, false);
            }
        } else {
            this._id = undefined;
            this._element = undefined;
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
                    this._element = undefined;
                    this._id = undefined;
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
        if (!byDatabaseUpdate && !this._id) {
            this._node.markChanged();
        }
        this._element = undefined;
        this._id = undefined;
    }

    /**
     * called to save the property
     * does nothing on the one side
     */
    save(): void {
        // do nothing,
    }

}
