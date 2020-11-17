import { NamedSyncNode } from "../../../../nodes/NamedSyncNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";

/**
 * command to load a named node
 */
export abstract class LoadNamedSyncNodesCommand<T extends NamedSyncNode> extends LoadSyncNodeListCommand<T> {

    /**
     * select only nodes when their name matches this _POSIX_ RegEx
     */
    public name?: string;

    /**
     * select only nodes when their description matches this _POSIX_ RegEx
     */
    public description?: string;

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.name !== undefined) {
            conditions.conditions.push({
                text: `main.name ~* $${conditions.i}`,
                values: [this.name],
                priority: 4
            });
            conditions.i++;
        }

        if (this.description !== undefined) {
            conditions.conditions.push({
                text: `main.description ~* $${conditions.i}`,
                values: [this.description],
                priority: 7
            });
            conditions.i++;
        }

        return conditions;
    }
}