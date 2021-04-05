import { BasePermission } from "../../../../nodes/BasePermission";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";
import { createStringListFilter } from "./RelationFilter";

/**
 * Command to load permissions
 */
export class LoadPermissionsCommand extends LoadMultipleNodeListsCommand<BasePermission> {

    /**
     * Only selects permissions which authorize at least one of the provided authorizables
     */
    public authorizables?: string[];

    /**
     * Creates a new LoadPermissionsCommand
     */
    public constructor() {
        super("base_permission");
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.authorizables !== undefined) {
            conditions.conditions.push(createStringListFilter("authorizable_id", this.authorizables, conditions.i, 4));
            conditions.i++;
        }

        return conditions;
    }

}