import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNamedNodesCommand } from "./LoadNamedNodeCommand";

/**
 * command to load NamedOwnedNodes
 */
export abstract class LoadNamedOwnedNodesCommand<T extends NamedOwnedNode> extends LoadNamedNodesCommand<T> {

    /**
     * Only select nodes which have one of the given users as owner
     */
    public onOwners?: string[]

    /**
     * adds the owner condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onOwners) {
            if (this.onOwners.length == 1) {
                conditions.conditions.push({
                    text: `main.owner_user_id=$${conditions.i}`,
                    values: [this.onOwners[0]],
                    priority: 6
                });
            } else {
                conditions.conditions.push({
                    text: `main.owner_user_id=ANY($${conditions.i})`,
                    values: [this.onOwners],
                    priority: 6
                });
            }
            conditions.i++;
        }

        return conditions;
    }
}