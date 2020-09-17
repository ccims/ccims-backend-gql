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
    public onName?: string;

    /**
     * select only nodes when their description matches this _POSIX_ RegEx
     */
    public onDescription?: string;

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onName) {
            if (this.onName.length == 1) {
                conditions.conditions.push({
                    text: `main.name=$${conditions.i}`,
                    values: [this.onName[0]],
                    priority: 4
                });
            } else {
                conditions.conditions.push({
                    text: `main.name=ANY($${conditions.i})`,
                    values: [this.onName],
                    priority: 4
                });
            }
            conditions.i++;
        }

        if (this.onDescription) {
            if (this.onDescription.length == 1) {
                conditions.conditions.push({
                    text: `main.description=$${conditions.i}`,
                    values: [this.onDescription[0]],
                    priority: 7
                });
            } else {
                conditions.conditions.push({
                    text: `main.description=ANY($${conditions.i})`,
                    values: [this.onDescription],
                    priority: 7
                });
            }
            conditions.i++;
        }

        return conditions;
    }
}