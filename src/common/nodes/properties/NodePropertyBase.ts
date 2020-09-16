import { CCIMSNode } from "../CCIMSNode";
import { DatabaseManager } from "../../database/DatabaseManager";
import { PropertySpecification } from "./PropertySpecification";

/**
 * property which represents the one side on a many to one relation
 * @param T the type of the other node
 * @param V the type of the node on which this property is
 */
export abstract class NodePropertyBase<T extends CCIMSNode, V extends CCIMSNode> {

    /**
     * the databaseManager
     */
    protected readonly _databaseManager: DatabaseManager;
    /**
     * the specification of the property
     */
    private readonly specification : PropertySpecification<T, V>;
    /**
     * the node on which this property is
     */
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