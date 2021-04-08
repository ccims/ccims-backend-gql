import { Comment } from "../../../../../nodes/timelineItems/Comment";
import { ConditionSpecification } from "../../ConditionSpecification";
import { createRelationFilterBySecundary } from "../RelationFilter";
import { LoadIssueTimelineItemsCommand } from "./LoadIssueTimelineItemsCommand";

export class LoadCommentsCommand extends LoadIssueTimelineItemsCommand<Comment> {

    /**
     * filters for comments edited by the specified user
     */
    public editedBy?: string[];

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        conditions.conditions.push({
            priority: 2,
            text: `pg_class.relname = ANY($${conditions.i})`,
            values: [["body", "comment"]]
        });
        conditions.i++;

        if (this.editedBy) {
            conditions.conditions.push(createRelationFilterBySecundary("comment", "edited_by", this.editedBy, conditions.i));
            conditions.i++;
        }

        return conditions;
    }
}