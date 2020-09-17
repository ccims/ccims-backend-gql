import { SyncNode } from "../../../../nodes/SyncNode";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * loads a list of syncNodes
 * @param T the type of SyncNode to load
 */
export abstract class LoadSyncNodeListCommand<T extends SyncNode> extends LoadNodeListCommand<T> {
    /**
     * if true, metadata is loaded
     */
    public loadWithMetadata: boolean = false;

    public loadDeleted: boolean = false;

    /**
     * gets a string with all rows that should be selected
     */
    protected get rows(): string {
        return this.loadWithMetadata ? super.rows + ", metadata" : super.rows;
    }

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
        return conditions;
    }
}