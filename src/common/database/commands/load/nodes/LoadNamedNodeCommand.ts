import { NamedNode } from "../../../../nodes/NamedNode";
import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a named node
 */
export abstract class LoadNamedNodesCommand<T extends NamedNode> extends LoadNodeListCommand<T> {
    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): {conditions: ConditionSpecification[], i: number} {
        return super.generateConditions(i);
    }
}