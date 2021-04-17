import { DatabaseManager } from "../../database/DatabaseManager";
import { CCIMSNode } from "../CCIMSNode";
import { Saveable } from "../Saveable";
import { PropertySpecification } from "./PropertySpecification";

/**
 * base interface of a property, this can be a propety on the many or on the one side
 * @param type of the element of the property
 */
export abstract class Property<T extends CCIMSNode, V extends CCIMSNode> extends Saveable {

    /**
     * the node on which this property is
     */
    protected readonly _node: V;

    /**
     * the current executed command
     */
    protected currentCommand: Promise<any> | undefined;

    /**
     * the specification of the property
     */
    private readonly specification : PropertySpecification<T, V>;

    protected constructor(databaseManger: DatabaseManager, node: V, specification: PropertySpecification<T, V>) {
        super(databaseManger);
        this._node = node;
        this.specification = specification;
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

    /**
     * called to notify a corresponding property that an add update occured
     * @param element the element that added the element on which this property is
     * @param byDatabaseUpdate true if a database update caused this update
     */
    public abstract wasAddedBy(element: T, byDatabaseUpdate: boolean): Promise<void>;
    /**
     * called to notify a corresponding property that an remove update occured
     * @param element the element that removed the element on which this property is
     * @param byDatabaseUpdate true if a database update caused this update
     */
    public abstract wasRemovedBy(element: T, byDatabaseUpdate: boolean): Promise<void>;
}