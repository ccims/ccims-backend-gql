import { NamedSyncNode } from "../../../../nodes/NamedSyncNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";

/**
 * command to load a named node
 */
export abstract class LoadNamedSyncNodesCommand<T extends NamedSyncNode> extends LoadSyncNodeListCommand<T> {

    /**
     * select only NamedSyncNodes when their name matches this _POSIX_ RegEx
     */
    public name: string | undefined;

    /**
     * select only NamedSyncNodes when their description matches this _POSIX_ RegEx
     */
    public description: string | undefined;

    /**
     * Select only NamedSyncNodes that were last updated after the given date (inclusive)
     */
    public lastUpdatedAfter: Date | undefined;

    /**
     * Select only NamedSyncNodes that were last updated before the given date (inclusive)
     */
    public lastUpdatedBefore: Date | undefined;

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

        if (this.lastUpdatedAfter !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.last_updated_at>=$${conditions.i}`,
                values: [this.lastUpdatedAfter],
            });
            conditions.i++;
        }
        if (this.lastUpdatedBefore !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.last_updated_at<=$${conditions.i}`,
                values: [this.lastUpdatedBefore],
            });
            conditions.i++;
        }

        return conditions;
    }
}