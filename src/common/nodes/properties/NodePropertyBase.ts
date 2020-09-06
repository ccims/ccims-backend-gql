import { CCIMSNode } from "../CCIMSNode";
import { DatabaseManager } from "../../database/DatabaseManager";
import { PropertySpecification } from "./PropertySpecification";

export abstract class NodePropertyBase<T extends CCIMSNode, V extends CCIMSNode> {

    protected readonly _databaseManager: DatabaseManager;
    private readonly specification : PropertySpecification<T, V>;
    protected readonly _node: V;
    

    /**
     * base functionality for node properties
     * @param databaseManager the databaseManager used to execute DatabaseCommands
     * @param specification the specification used to get notifiers
     * @param node the node proviced to all generators as last parameter
     */
    protected constructor(databaseManager: DatabaseManager, specification: PropertySpecification<T, V>, node: V) {
        this._databaseManager = databaseManager;
        this.specification = specification;
        this._node = node;
    }

    /**
     * notifies the element that this node was added
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    protected async notifyAdded(element: T, byDatabase: boolean): Promise<void> {
        await Promise.all(this.specification.notifiers.map(notifier => {
            const toNotify = notifier(element, this._node);
            return toNotify.wasAddedBy(this._node, byDatabase);
        }));
    }

    /**
     * notifies the element that this node was removed
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    protected async notifyRemoved(element: T, byDatabase: boolean): Promise<void> {
        await Promise.all(this.specification.notifiers.map(notifier => {
            const toNotify = notifier(element, this._node);
            return toNotify.wasRemovedBy(this._node, byDatabase);
        }));
    }
}