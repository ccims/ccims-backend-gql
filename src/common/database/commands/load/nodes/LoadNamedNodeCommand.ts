import { NamedNode } from "../../../../nodes/NamedNode";
import { NamedOwnedNode } from "../../../../nodes/NamedOwnedNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { SignatureHelpRetriggeredReason } from "typescript";

/**
 * command to load a named node
 */
export abstract class LoadNamedNodesCommand<T extends NamedNode> extends LoadNodeListCommand<T> {

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

        if (this.name) {
            conditions.conditions.push({
                text: `main.name ~ $${conditions.i}`,
                values: [this.name],
                priority: 4
            });
            conditions.i++;
        }

        if (this.description) {
            conditions.conditions.push({
                text: `main.description ~ $${conditions.i}`,
                values: [this.description],
                priority: 7
            });
            conditions.i++;
        }

        return conditions;
    }
}