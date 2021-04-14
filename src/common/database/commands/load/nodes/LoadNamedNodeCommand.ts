import { NamedNode } from "../../../../nodes/NamedNode";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a named node
 */
export abstract class LoadNamedNodesCommand<T extends NamedNode> extends LoadNodeListCommand<T> {

    /**
     * select only nodes when their name matches this _POSIX_ RegEx
     */
    public name: string | undefined;

    /**
     * select only nodes when their description matches this _POSIX_ RegEx
     */
    public description: string | undefined;

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

        return conditions;
    }
}