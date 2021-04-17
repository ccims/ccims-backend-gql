import { SyncNode } from "../../../../nodes/SyncNode";
import { QueryPart } from "../QueryPart";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export class LoadMultipleSyncNodeListsCommand<T extends SyncNode> extends LoadMultipleNodeListsCommand<T> {
    /**
     * If true also loads nodes which are marked as deleted
     */
    public loadDeleted: boolean = false;

    /**
     * Select only sync nodes that were created by one of the users with the given IDs
     */
    public createdBy: string[] | undefined;

    /**
     * Select only sync nodes created after the given Date __(inclusive)__
     */
    public createdAfter: Date | undefined;

    /**
     * Select only sync nodes created before the given Date __(inclusive)__
     */
    public createdBefore: Date | undefined;

    /**
     * Selects only sync nodes which were modified after the given Date __(inclusive)__
     */
    public modifiedSince: Date | undefined;

    protected constructor(tableName: string, loadDeleted: boolean = false) {
        super(tableName);
        this.loadDeleted = loadDeleted;
    }

    protected getLoadCommand(tableName: string): LoadNodeListCommand<T> {
        return require("./LoadFromIdsCommand").getLoadCommand(tableName, [], this.loadDeleted) as LoadNodeListCommand<T>;
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
     protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);
        if (!this.loadDeleted) {
            conditions.conditions.push({
                text: "main.deleted=false",
                values: []
            });
        }

        if (this.createdBy !== undefined) {
            if (this.createdBy.length === 1) {
                conditions.conditions.push({
                    text: `main.created_by_id=$${conditions.i}`,
                    values: [this.createdBy[0]],
                });
            } else {
                conditions.conditions.push({
                    text: `main.created_by_id=ANY($${conditions.i})`,
                    values: [this.createdBy],
                });
            }
            conditions.i++;
        }

        if (this.createdAfter !== undefined) {
            conditions.conditions.push({
                text: `main.created_at >= $${conditions.i}`,
                values: [this.createdAfter],
            });
            conditions.i++;
        }

        if (this.createdBefore !== undefined) {
            conditions.conditions.push({
                text: `main.created_at <= $${conditions.i}`,
                values: [this.createdBefore],
            });
            conditions.i++;
        }

        if (this.modifiedSince !== undefined) {
            conditions.conditions.push({
                text: `main.last_modified_at >= $${conditions.i}`,
                values: [this.modifiedSince],
            });
            conditions.i++;
        }
        return conditions;
    }

}