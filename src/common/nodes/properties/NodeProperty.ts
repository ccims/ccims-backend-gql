import { CCIMSNode } from "../CCIMSNode";
import { NodePropertyBase } from "./NodePropertyBase";
import { Property } from "./Property";
import { NodePropertySpecification } from "./NodePropertySpecification";
import { DatabaseManager } from "../../database/DatabaseManager";

export class NodeProperty<T extends CCIMSNode, V extends CCIMSNode> extends NodePropertyBase<T, V> implements Property<T> {

    private readonly _specification: NodePropertySpecification<T, V>;
    private _id: string;
    private _element?: T;

    /**
     * creates a new NodeProperty with the provided specification
     * @param id the id of the element this property is currently set to
     * @param databaseManager  the databaseManager used to execute DatabaseCommands
     * @param specification  the specification of this property
     * @param node the node which contains this property
     */
    public constructor(databaseManager: DatabaseManager, specification: NodePropertySpecification<T, V>, node: V, id: string, ) {
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
                this.notifyRemoved(this._element, false);
            }
        }
        if (value.id === this._id) {
            this._element = value;
        } else {
            this._element = value;
            this._id = value.id;
            this.notifyAdded(value, false);
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
                } else {
                    throw new Error("inconsistent database state: no property found")
                }
            }
        }
    }

    async wasAddedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        if (!byDatabaseUpdate && element.id !== this._id) {
            this._node.markChanged();
        }
        this._element = element;
        this._id = element.id;
    }
    async wasRemovedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        //this can only be a temporary state, so just ignore it
    }

    save(): void {
        //do nothing, 
    }

}