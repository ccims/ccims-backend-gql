import { ConditionSpecification } from "../../ConditionSpecification";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";
import { createRelationFilterBySecundary } from "../RelationFilter";
import { CommentIssueTimelineItem } from "../../../../../nodes/timelineItems/CommentIssueTimelineItem";

export abstract class LoadCommentIssueTimelineItemsCommandBase<T extends CommentIssueTimelineItem> extends LoadIssueTimelineItemsCommandBase<T> {
    /**
     * filters for reactions
     */
    public reactions: string[][] | undefined;

    /**
     * filters for Comments which were last edited before the specified date
     */
    public lastEditedBefore: Date | undefined;

    /**
     * filters for Comments which were last edited after the specified date
     */
    public lastEditedAfter: Date | undefined;

    /**
     * Select only comments that were deited by at least one of the given users
     */
    public editedBy: string[] | undefined;

    /**
     * filters for Comments where the body matches the provided regex
     */
    public body: string | undefined;

    /**
     * Select only comments on issues that are assigned to at least one of these components
     */
    public onComponents: string[] | undefined;

    /**
     * If set and `true`, only CommentIssueTimelineItems that the current user is allowed to edit the body on will be selected. If `false` only those where he isn't.
     * TODO
     */
    public currentUserCanEdit: boolean | undefined;

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
                text: `main.body ~* $${conditions.i}`,
                values: [this.body],
            });
            conditions.i++;
        }

        if (this.onComponents) {
            if (this.onComponents.length === 1) {
                conditions.conditions.push({
                    text: `main.issue=ANY(SELECT issue_id FROM relation_component_issue WHERE component_id=$${conditions.i})`,
                    values: [this.onComponents[0]],
                    priority: 6
                });
            } else {
                conditions.conditions.push({
                    text: `main.issue=ANY(SELECT issue_id FROM relation_component_issue WHERE component_id=ANY($${conditions.i}))`,
                    values: [this.onComponents],
                    priority: 6
                });
            }
            conditions.i++;
        }

        if (this.editedBy) {
            conditions.conditions.push(createRelationFilterBySecundary("comment", "edited_by", this.editedBy, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}