import { CCIMSNode } from "../CCIMSNode";
import { DatabaseCommand } from "../../database/DatabaseCommand";
import { Property } from "./Property";
import { PropertySpecification } from "./PropertySpecification";

/**
 * specification of property
 * @param T the type of the other node
 * @param V the type of the node on which this property is
 */
export class NodePropertySpecification<T extends CCIMSNode, V extends CCIMSNode>  implements PropertySpecification<T, V> {

    /**
     * a list of functions which generate nodes which should be notified on remove or add
     */
    public readonly notifiers: ((element: T, node: V) => Property<V>)[];

    /**
     * creates a specification for for a NodeProperty
     * @param loadFromId command generator to load the element by id
     * @param reload command generator to reload this property without an id, because database updates are a thing
     * @param notifiers get properties to notify
     */
    public constructor(
        public readonly loadFromId: (id: string, node: V) => DatabaseCommand<T | undefined>,
        public readonly reload: (node: V) => DatabaseCommand<T | undefined>,
        ...notifiers: ((element: T, node: V) => Property<V>)[]
    ) {
        this.notifiers = notifiers;
    }
}