import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export abstract class LoadNamedNodesCommand<T extends NamedOwnedNode> extends LoadNodeListCommand<T> {
    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): [ConditionSpecification[], number] {
        const [conditions, i2] = super.generateConditions(i);
        i = i2;

        //TODO
        
        return [conditions, i];
    }
}