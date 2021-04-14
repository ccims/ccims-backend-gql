import { IssueTimelineItem } from "../../../../../nodes/timelineItems/IssueTimelineItem";
import { QueryPart } from "../../QueryPart";
import { LoadSyncNodeListCommand } from "../LoadSyncNodeListCommand";
import { createStringListFilter } from "../RelationFilter";

export abstract class LoadIssueTimelineItemsCommandBase<T extends IssueTimelineItem> extends LoadSyncNodeListCommand<T> {
    /**
     * filter for timelineItems that are on any of the issues
     */
    public onIssues: string[] | undefined;

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onIssues !== undefined) {
            conditions.conditions.push(createStringListFilter("issue", this.onIssues, i));
            conditions.i++;
        }

        return conditions;
    }
}