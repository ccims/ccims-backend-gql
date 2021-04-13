import { CCIMSNode } from "../CCIMSNode";
import { DatabaseManager } from "../../database/DatabaseManager";
import { PropertySpecification } from "./PropertySpecification";
import { Saveable } from "../Saveable";
import { Property } from "./Property";

/**
 * property which represents the one side on a many to one relation
 * @param T the type of the other node
 * @param V the type of the node on which this property is
 */
export abstract class NodePropertyBase<T extends CCIMSNode, V extends CCIMSNode> extends Property<T, V> {

    /**
     * the other node if already loaded
     */
    protected _element: T | undefined;


    /**
     * base functionality for node properties
     * @param databaseManager the databaseManager used to execute DatabaseCommands
     * @param specification the specification used to get notifiers
     * @param node the node proviced to all generators as last parameter
     */
    protected constructor(databaseManager: DatabaseManager, specification: PropertySpecification<T, V>, node: V) {
        super(databaseManager, node, specification);
    }

    /**
     * ensures that this property is loaded
     */
    protected async ensureLoaded(): Promise<void> {
        while (this.currentCommand !== undefined) {
            await this.currentCommand;
        }
        this.currentCommand = this.ensureLoadedInternal();
        await this.currentCommand;
        this.currentCommand = undefined;
    }

    protected abstract ensureLoadedInternal(): Promise<void>;

    public async markDeleted(): Promise<void> {
        await this.ensureLoaded();
        if (this._element) {
            await this.notifyRemoved(this._element, false);
        }
    }
}