import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNamedNodesCommand } from "./LoadNamedNodeCommand";
import { createStringListFilter } from "./RelationFilter";

/**
 * command to load NamedOwnedNodes
 */
export abstract class LoadNamedOwnedNodesCommand<T extends NamedOwnedNode> extends LoadNamedNodesCommand<T> {

    /**
     * Only select nodes which have one of the given users as owner
     */
    public ownedBy?: string[]

    /**
     * adds the owner condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.ownedBy) {
            conditions.conditions.push(createStringListFilter("owner_user_id", this.ownedBy, conditions.i, 3));
            conditions.i++;
        }

        return conditions;
    }
}