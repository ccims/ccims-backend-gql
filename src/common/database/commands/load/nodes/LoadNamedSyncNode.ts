import { NamedSyncNode } from "../../../../nodes/NamedSyncNode";
import { QueryPart } from "../QueryPart";
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
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.name !== undefined) {
            conditions.conditions.push({
                text: `main.name ~* $${conditions.i}`,
                values: [this.name],
            });
            conditions.i++;
        }

        if (this.description !== undefined) {
            conditions.conditions.push({
                text: `main.description ~* $${conditions.i}`,
                values: [this.description],
            });
            conditions.i++;
        }

        if (this.lastUpdatedAfter !== undefined) {
            conditions.conditions.push({
                text: `main.last_updated_at>=$${conditions.i}`,
                values: [this.lastUpdatedAfter],
            });
            conditions.i++;
        }
        if (this.lastUpdatedBefore !== undefined) {
            conditions.conditions.push({
                text: `main.last_updated_at<=$${conditions.i}`,
                values: [this.lastUpdatedBefore],
            });
            conditions.i++;
        }

        return conditions;
    }
}