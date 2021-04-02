import { IssueTimelineItem, IssueTimelineItemType } from "../../../../../nodes/timelineItems/IssueTimelineItem";
import { ConditionSpecification } from "../../ConditionSpecification";
import { QueryPart } from "../../QueryPart";
import { LoadMultipleSyncNodeListsCommand } from "../LoadMultipleSyncNodeListsCommand";
import { LoadNodeListCommand } from "../LoadNodeListCommand";
import { LoadSyncNodeListCommand } from "../LoadSyncNodeListCommand";
import { createStringListFilter } from "../RelationFilter";

export class LoadIssueTimelineItemsCommand<T extends IssueTimelineItem = IssueTimelineItem> extends LoadMultipleSyncNodeListsCommand<T> {

    /**
     * filter for timelineItems that are on any of the issues
     */
    public onIssues?: string[];

    /**
     * if true, no body
     */
    public noBody: boolean = false;

    /**
     * filters for IssueTimelineItems of the specified types
     */
    public types?: IssueTimelineItemType[];

    /**
     * creates a new
     */
    public constructor() {
        super("issue_timeline_item");
    }

    protected getLoadCommand(tableName: string): LoadNodeListCommand<T> {
        const command = super.getLoadCommand(tableName) as LoadSyncNodeListCommand<T>;
        return command;
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onIssues !== undefined) {
            conditions.conditions.push(createStringListFilter("issue", this.onIssues, i, 4));
            conditions.i++;
        }
        if (this.noBody !== undefined) {
            conditions.conditions.push({
                priority: 10,
                text: `pg_class.relname != $${conditions.i}`,
                values: ["issue_timeline_body"]
            });
            conditions.i++;
        }
        if (this.types !== undefined) {
            if (this.types.length === 1) {
                conditions.conditions.push({
                    priority: 10,
                    text: `pg_class.relname = $${conditions.i}`,
                    values: [this.types[0].tableName]
                });
            } else {
                conditions.conditions.push({
                    priority: 10,
                    text: `pg_class.relname = ANY($${conditions.i})`,
                    values: [this.types.map(type => type.tableName)]
                });
            }
            conditions.i++;
        }

        return conditions;
    }

    /**
     * generates the conditions for pagination
     * only called when !this.countMode
     * @param i the next value index
     * @returns the conditions for pagination
     */
    protected generatePaginationConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions: ConditionSpecification[] = [];
        if (this.afterId !== undefined) {
            conditions.push({
                priority: 2,
                text: `(main.created_at > (SELECT created_at FROM ${this.tableName} WHERE id=$${i})) OR ((main.created_at = (SELECT created_at FROM ${this.tableName} WHERE id=$${i})) AND (main.id > $${i}))`,
                values: [this.afterId]
            });
            i++;
        }
        if (this.beforeId !== undefined) {
            conditions.push({
                priority: 2,
                text: `(main.created_at < (SELECT created_at FROM ${this.tableName} WHERE id=$${i})) OR ((main.created_at = (SELECT created_at FROM ${this.tableName} WHERE id=$${i})) AND (main.id < $${i}))`,
                values: [this.beforeId]
            });
            i++;
        }
        return { conditions, i };
    }

    /**
     * generates the end of the query, for example a limit or a order
     * @param i the next index for a value in the query
     * @returns the end of the query
     */
    protected generateQueryEnd(i: number): QueryPart {
        if (this.limit && !this.countMode) {
            return {
                text: `ORDER BY main.created_at ${this.first ? "ASC" : "DESC"}, main.id ${this.first ? "ASC" : "DESC"} LIMIT $${i}`,
                values: [this.limit + 1]
            }
        } else if (!this.countMode) {
            return {
                text: "ORDER BY main.created_at ASC, main.id ASC;",
                values: []
            }
        } else {
            return {
                text: ";",
                values: []
            }
        }
    }
}