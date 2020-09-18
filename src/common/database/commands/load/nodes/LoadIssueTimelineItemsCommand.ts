import { IssueTimelineItem } from "../../../../nodes/timelineItems/IssueTimelineItem";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";
import { createRelationFilterOnOne } from "./RelationFilter";

export class LoadIssueTimelineItemsCommand extends LoadMultipleNodeListsCommand<IssueTimelineItem> {

    /**
     * filter for timelineItems that are on any of the issues
     */
    public onIssues?: string[];

    /**
     * creates a new 
     */
    public constructor() {
        super("issue_timelineItem");
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onIssues) {
            conditions.conditions.push(createRelationFilterOnOne("issue", this.onIssues, i, 4));
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
        if (this.afterId) {
            conditions.push({
                priority: 2,
                text: `(main.created_at > (SELECT created_at FROM ${this.tableName} WHERE id=$1)) OR ((main.created_at = (SELECT created_at FROM ${this.tableName} WHERE id=$1)) AND (main.id > $1))`,
                values: [this.afterId]
            });
            i++;
        }
        if (this.beforeId) {
            conditions.push({
                priority: 2,
                text: `(main.created_at < (SELECT created_at FROM ${this.tableName} WHERE id=$1)) OR ((main.created_at = (SELECT created_at FROM ${this.tableName} WHERE id=$1)) AND (main.id < $1))`,
                values: [this.beforeId]
            });
            i++;
        }
        return {conditions: conditions, i: i};
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
                values: [this.limit]
            }
        } else {
            return {
                text: "ORDER BY main.created_at ASC, main.id ASC",
                values: []
            }
        }
    }
}