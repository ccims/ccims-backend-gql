import { CCIMSNode } from "../CCIMSNode";
import { Property } from "./Property";

export interface PropertySpecification<T extends CCIMSNode, V extends CCIMSNode> {
    readonly notifiers: ((element: T, node: V) => Property<V>)[];
}