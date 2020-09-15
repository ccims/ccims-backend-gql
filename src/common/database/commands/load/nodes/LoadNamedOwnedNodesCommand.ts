import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNamedNodesCommand } from "./LoadNamedNodeCommand";

export abstract class LoadNamedOwnedNodesCommand<T extends NamedOwnedNode> extends LoadNamedNodesCommand<T> {
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