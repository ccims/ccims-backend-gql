import { CCIMSNode } from "../CCIMSNode";
import { Property } from "./Property";

/**
 * specification of a property
 * @param T the type of the other node
 * @param V the type of the node on which this property is
 */
export interface PropertySpecification<T extends CCIMSNode, V extends CCIMSNode> {
    /**
     * array of functions which return nodes to notify on changes
     */
    readonly notifiers: ((element: T, node: V) => Property<V>)[];
}