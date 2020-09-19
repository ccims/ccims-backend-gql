import { Comment } from "../../../../../nodes/timelineItems/Comment";
import { ConditionSpecification } from "../../ConditionSpecification";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

export abstract class LoadCommentsCommandBase<T extends Comment> extends LoadIssueTimelineItemsCommandBase<T> {
    /**
     * filters for reactions
     */
    public reactions?: string[][];

    /**
     * filters for Comments which were last edited before the specified date
     */
    public lastEditedBefore?: Date;

    /**
     * filters for Comments which were last edited after the specified date
     */
    public lastEditedAfter?: Date;

    /**
     * filters for Comments where the body matches the provided regex
     */
    public body?: string;

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.lastEditedAfter) {
            conditions.conditions.push({
                text: `main.edited_after >= $${conditions.i}`,
                values: [this.lastEditedAfter],
                priority: 4
            });
            conditions.i++;
        }

        if (this.lastEditedBefore) {
            conditions.conditions.push({
                text: `main.edited_before <= $${conditions.i}`,
                values: [this.lastEditedBefore],
                priority: 4
            });
            conditions.i++;
        }

        if (this.body) {
            conditions.conditions.push({
                priority: 5,
                text: `main.body ~ $${conditions.i}`,
                values: [this.body],
            });
            conditions.i++;
        }

        return conditions;
    }
    
}