import { QueryResultRow, QueryResult } from "pg";
import { Issue, IssueCategory, IssueTableSpecification } from "../../../../nodes/Issue";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary, createStringListFilter } from "./RelationFilter";

export class LoadIssuesCommand extends LoadSyncNodeListCommand<Issue> {

    /**
     * Select only issues of which the title matches this regex
     */
    public title?: string;

    /**
     * Select only issues which are on one of these components
     */
    public onComponents?: string[];

    /**
     * Select only issues which are on any component on one of these projects
     */
    public onProjects?: string[];

    /**
     * Select only issues when their body matches this regex
     */
    public body?: string;

    /**
     * Select only issues which were edited by one of these users
     */
    public editedBy?: string[];

    /**
     * Select only issues that were last edited after the given date (inclusive)
     * Only including edits to the issues title or body
     */
    public lastEditedAfter?: string[];

    /**
     * Select only issues that were last edited before the given date (inclusive)
     * Only including edits to the issues title or body
     */
    public lastEditedBefore?: string[];

    /**
     * Select only issues that were last updated after the given date (inclusive)
     * This includes any changes to the issue or its comments
     */
    public updatedAfter?: string[];

    /**
     * Select only issues that were last updated before the given date (inclusive)
     * This includes any changes to the issue or its comments
     */
    public updatedBefore?: string[];

    /**
     * If set and `true`, only issues that are open are selected. If `false`, only closed issue
     */
    public isOpen?: boolean;

    /**
     * If set and `true`, only issues that are a duplicate of another issue are selected. If `false`, only issues which are not marked as duplicate
     */
    public isDuplicate?: boolean;

    /**
     * filters for issues where any of the users is assigned
     */
    public userAssigned?: string[];

    /**
     * filter for issues with one of the specified categories
     */
    public ofCategory?: IssueCategory[]

    /**
     * Select only issues linking __to__ one of the given issues (origin of the relation)
     */
    public linksToIssues?: string[];

    /**
     * Select only issues __being linked to__ one of the given issues (destination of the relation)
     */
    public linkedByIssues?: string[];

    /**
     * Select only issues, that link to at least one other issue
     */
    public linksToAnyIssues?: boolean;

    /**
     * Select only issues that have all of the reactions in one of the given list entries on their body
     * TODO
     */
    public reactions?: string[][];

    /**
     * Select only issues that have one of these labels assigned
     */
    public labels?: string[];

    /**
     * filters for issues where any of the users perticipated
     */
    public userParticipated?: string[];

    /**
     * Select only issues that are assigned to at least one of these locations
     */
    public onLocations?: string[];

    /**
     * If set and `true`, only issues that the current user is allowed to edit the body on will be selected. If `false` only those where he isn't.
     * TODO
     */
    public currentUserCanEdit?: boolean;

    /**
     * If set and `true`, only issues that the current user is allowed to comment on will be selected. If `false` only those where he isn't.
     * TODO
     */
    public currentUserCanComment?: boolean;

    /**
     * Select only issues that have a start date after this date (inclusive)
     */
    public startDateAfter?: Date;

    /**
     * Select only issues that have a start date before this date (inclusive)
     */
    public startDateBefore?: Date;

    /**
     * Select only issues that have a due date after this date (inclusive)
     */
    public dueDateAfter?: Date;

    /**
     * Select only issues that have a due date before this date (inclusive)
     */
    public dueDateBefore?: Date;

    /**
     * Select only issues that have an estimated time which is at __least__ the given time span in milliseconds (inclusive)
     */
    public estimatedTimeGreaterThan?: number;

    /**
     * Select only issues that have an estimated time which is at __most__ the given time span in milliseconds (inclusive)
     */
    public estimatedTimeLowerThan?: number;

    /**
     * Select only issues that have an spent time which is at __least__ the given time span in milliseconds (inclusive)
     */
    public spentTimeGreaterThan?: number;

    /**
     * Select only issues that have an spent time which is at __most__ the given time span in milliseconds (inclusive)
     */
    public spentTimeLowerThan?: number;

    public constructor() {
        super(IssueTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Issue {
        return new Issue(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.title, resultRow.is_open, resultRow.is_duplicate,
            resultRow.category, resultRow.start_date, resultRow.due_date, resultRow.estimated_time, resultRow.spent_time, resultRow.updated_at,
            resultRow.body_id, resultRow.deleted, this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_issue main `,
            values: []
        };
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.userParticipated !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "participant", this.userParticipated, conditions.i));
            conditions.i++;
        }
        if (this.userAssigned !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "assignee", this.userAssigned, conditions.i));
            conditions.i++;
        }
        if (this.ofCategory !== undefined) {
            conditions.conditions.push(createStringListFilter("category", this.ofCategory, conditions.i, 5));
            conditions.i++;
        }
        if (this.onComponents !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "issue", this.onComponents, conditions.i));
            conditions.i++;
        }
        if (this.onLocations !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issueLocation", "issue", this.onLocations, conditions.i));
            conditions.i++;
        }
        if (this.onProjects !== undefined) {
            if (this.onProjects.length === 1) {
                conditions.conditions.push({
                    priority: 2,
                    text: `main.component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${conditions.i})`,
                    values: [this.onProjects[0]]
                });
            } else {
                conditions.conditions.push({
                    priority: 2,
                    text: `main.component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${conditions.i}))`,
                    values: [this.onProjects[0]]
                });
            }
            conditions.i++;
        }
        if (this.editedBy !== undefined) {
            if (this.editedBy.length === 1) {
                conditions.conditions.push({
                    priority: 2,
                    text: `EXISTS(SELECT 1 FROM relation_comment_editedBy WHERE comment_id=main.body_id AND editedBy_id=$${conditions.i})`,
                    values: [this.editedBy[0]]
                });
            } else {
                conditions.conditions.push({
                    priority: 2,
                    text: `EXISTS(SELECT 1 FROM relation_comment_editedBy WHERE comment_id=main.body_id AND editedBy_id=ANY($${conditions.i}))`,
                    values: [this.editedBy]
                });
            }
            conditions.i++;
        }
        if (this.lastEditedBefore !== undefined) {
            conditions.conditions.push({
                priority: 2,
                text: `EXISTS(SELECT 1 FROM issue_timeline_body WHERE issue=main.body_id AND last_edited_at <= $${conditions.i})`,
                values: [this.lastEditedBefore]
            });
            conditions.i++;
        }
        if (this.lastEditedAfter !== undefined) {
            conditions.conditions.push({
                priority: 2,
                text: `EXISTS(SELECT 1 FROM issue_timeline_body WHERE issue=main.body_id AND last_edited_at >= $${conditions.i})`,
                values: [this.lastEditedAfter]
            });
            conditions.i++;
        }
        if (this.title !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.title ~ $${conditions.i}`,
                values: [this.title],
            });
            conditions.i++;
        }
        if (this.body !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `EXISTS(SELECT 1 FROM issue_timeline_body WHERE issue=main.body_id AND body ~ $${conditions.i})`,
                values: [this.body],
            });
            conditions.i++;
        }
        if (this.updatedAfter !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.updated_at>=$${conditions.i}`,
                values: [this.updatedAfter],
            });
            conditions.i++;
        }
        if (this.updatedBefore !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.updated_at<=$${conditions.i}`,
                values: [this.updatedBefore],
            });
            conditions.i++;
        }
        if (this.isOpen !== undefined) {
            conditions.conditions.push({
                priority: 4,
                text: `main.is_open = $${conditions.i}`,
                values: [this.isOpen],
            });
            conditions.i++;
        }
        if (this.isDuplicate !== undefined) {
            conditions.conditions.push({
                priority: 4,
                text: `main.isDuplicate = $${conditions.i}`,
                values: [this.isDuplicate],
            });
            conditions.i++;
        }
        if (this.linkedByIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "linkedIssue", this.linkedByIssues, conditions.i));
            conditions.i++;
        }
        if (this.linksToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "linkedIssue", this.linksToIssues, conditions.i));
            conditions.i++;
        }
        if (this.linksToAnyIssues !== undefined) {
            if (this.linksToAnyIssues) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT issue_id FROM relation_issue_linkedIssue)`,
                    values: [],
                    priority: 4
                });
            } else {
                conditions.conditions.push({
                    text: `main.id!=ANY(SELECT issue_id FROM relation_issue_linkedIssue)`,
                    values: [],
                    priority: 4
                });
            }
        }
        if (this.labels !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "label", this.labels, conditions.i));
            conditions.i++;
        }
        if (this.startDateAfter !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.start_date>=$${conditions.i}`,
                values: [this.startDateAfter],
            });
            conditions.i++;
        }
        if (this.startDateBefore !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.start_date<=$${conditions.i}`,
                values: [this.startDateBefore],
            });
            conditions.i++;
        }
        if (this.dueDateAfter !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.due_date>=$${conditions.i}`,
                values: [this.dueDateAfter],
            });
            conditions.i++;
        }
        if (this.dueDateBefore !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.due_date<=$${conditions.i}`,
                values: [this.dueDateBefore],
            });
            conditions.i++;
        }

        if (this.estimatedTimeGreaterThan !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.estimated_time>=$${conditions.i}`,
                values: [this.estimatedTimeGreaterThan],
            });
            conditions.i++;
        }
        if (this.estimatedTimeLowerThan !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.estimated_time<=$${conditions.i}`,
                values: [this.estimatedTimeLowerThan],
            });
            conditions.i++;
        }
        if (this.spentTimeGreaterThan !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.spent_time>=$${conditions.i}`,
                values: [this.spentTimeGreaterThan],
            });
            conditions.i++;
        }
        if (this.spentTimeLowerThan !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.spent_time<=$${conditions.i}`,
                values: [this.spentTimeLowerThan],
            });
            conditions.i++;
        }

        return conditions;
    }

}