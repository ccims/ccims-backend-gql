import { SyncNode } from "../../../../nodes/SyncNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";

export class LoadMultipleSyncNodeListsCommand<T extends SyncNode> extends LoadMultipleNodeListsCommand<T> {
    /**
     * If true also loads nodes which are marked as deleted
     */
    public loadDeleted: boolean = false;

    /**
     * Select only sync nodes that were created by one of the users with the given IDs
     */
    public createdBy?: string[];

    /**
     * Select only sync nodes created after the given Date __(inclusive)__
     */
    public createdAfter?: Date;

    /**
     * Select only sync nodes created before the given Date __(inclusive)__
     */
    public createdBefore?: Date;

    /**
     * Selects only sync nodes which were modified after the given Date __(inclusive)__
     */
    public modifiedSince?: Date;

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
     protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);
        if (!this.loadDeleted) {
            conditions.conditions.push({
                priority: 3,
                text: "main.deleted=false",
                values: []
            });
        }

        if (this.createdBy !== undefined) {
            if (this.createdBy.length === 1) {
                conditions.conditions.push({
                    text: `main.created_by=$${conditions.i}`,
                    values: [this.createdBy[0]],
                    priority: 5
                });
            } else {
                conditions.conditions.push({
                    text: `main.created_by=ANY($${conditions.i})`,
                    values: [this.createdBy],
                    priority: 5
                });
            }
            conditions.i++;
        }

        if (this.createdAfter !== undefined) {
            conditions.conditions.push({
                text: `main.created_at >= $${conditions.i}`,
                values: [this.createdAfter],
                priority: 4
            });
            conditions.i++;
        }

        if (this.createdBefore !== undefined) {
            conditions.conditions.push({
                text: `main.created_at <= $${conditions.i}`,
                values: [this.createdBefore],
                priority: 4
            });
            conditions.i++;
        }

        if (this.modifiedSince !== undefined) {
            conditions.conditions.push({
                text: `main.last_modified_at >= $${conditions.i}`,
                values: [this.modifiedSince],
                priority: 4
            });
            conditions.i++;
        }
        return conditions;
    }

}