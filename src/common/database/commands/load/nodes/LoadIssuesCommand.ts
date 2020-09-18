import { QueryResultRow, QueryResult } from "pg";
import { Issue, IssueCategory, IssueTableSpecification } from "../../../../nodes/Issue";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createRelationFilterBySecundary, createStringListFilter } from "./RelationFilter";

export class LoadIssuesCommand extends LoadSyncNodeListCommand<Issue> {

    /**
     * Select only issues of which the title matches this regex
     * TODO
     */
    public title?: string;

    /**
     * Select only issues which are on one of these components
     * TODO
     */
    public onComponents?: string[];

    /**
     * Select only issues when their body matches this regex
     * TODO
     */
    public body?: string;

    /**
     * Select only issues which were edited by one of these users
     * TODO
     */
    public editedBy?: string[];

    /**
     * Select only issues that were last edited after the given date (inclusive)
     * Only including edits to the issues title or body
     * TODO
     */
    public editedAfter?: string[];

    /**
     * Select only issues that were last edited before the given date (inclusive)
     * Only including edits to the issues title or body
     * TODO
     */
    public editedBefore?: string[];

    /**
     * Select only issues that were last updated after the given date (inclusive)
     * This includes any changes to the issue or its comments
     * TODO
     */
    public updatedAfter?: string[];

    /**
     * Select only issues that were last updated before the given date (inclusive)
     * This includes any changes to the issue or its comments
     * TODO
     */
    public updatedBefore?: string[];

    /**
     * If set and `true`, only issues that are open are selected. If `false`, only closed issue
     * TODO
     */
    public isOpen?: boolean;

    /**
     * If set and `true`, only issues that are a duplicate of another issue are selected. If `false`, only issues which are not marked as duplicate
     * TODO
     */
    public isDuplicate?: boolean;

    /**
     * filter for issues with one of the specified categories
     */
    public ofCategory?: IssueCategory[]

    /**
     * Select only issues linking __to__ one of the given issues (origin of the relation)
     * TODO
     */
    public linksToIssues?: string[];

    /**
     * Select only issues __being linked to__ one of the given issues (destination of the relation)
     * TODO
     */
    public linkedByIssues?: string[];

    /**
     * Select only issues that have all of the reactions in one of the given list entries on their body
     * TODO
     */
    public reactions?: string[][];

    /**
     * Select only issues that have at least one of these assignees
     * TODO
     */
    public assignees?: string[];

    /**
     * Select only issues that have one of these labels assigned
     * TODO
     */
    public labels?: string[];

    /**
     * filters for issues where any of the users perticipated
     */
    public userParticipated?: string[];

    /**
     * Select only issues that are assigned to at least one of these locations
     * TODO
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
     * TODO
     */
    public startDateAfter?: Date;

    /**
     * Select only issues that have a start date before this date (inclusive)
     * TODO
     */
    public startDateBefore?: Date;

    /**
     * Select only issues that have a due date after this date (inclusive)
     * TODO
     */
    public dueDateAfter?: Date;

    /**
     * Select only issues that have a due date before this date (inclusive)
     * TODO
     */
    public dueDateBefore?: Date;

    /**
     * Select only issues that have an estimated time which is at __least__ the given time span in milliseconds (inclusive)
     * TODO
     */
    public estimatedTimeGreaterThan?: number;

    /**
     * Select only issues that have an estimated time which is at __most__ the given time span in milliseconds (inclusive)
     * TODO
     */
    public estimatedTimeLowerThan?: number;

    /**
     * Select only issues that have an spent time which is at __least__ the given time span in milliseconds (inclusive)
     * TODO
     */
    public spentTimeGreaterThan?: number;

    /**
     * Select only issues that have an spent time which is at __most__ the given time span in milliseconds (inclusive)
     * TODO
     */
    public spentTimeLowerThan?: number;

    public constructor() {
        super(IssueTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Issue {
        return new Issue(databaseManager, resultRow["id"], resultRow["created_by"], resultRow["created_at"], resultRow["title"], resultRow["is_open"], resultRow["is_duplicate"],
            resultRow["category"], resultRow["start_date"], resultRow["due_date"], resultRow["estimated_time"], resultRow["spent_time"], resultRow["updated_at"],
            resultRow["body_id"], resultRow["deleted"], this.loadWithMetadata ? resultRow["metadata"] : undefined);
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

        if (this.userParticipated) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "participant", this.userParticipated, conditions.i));
            conditions.i++;
        }
        if (this.ofCategory) {
            conditions.conditions.push(createStringListFilter("category", this.ofCategory, conditions.i, 5));
            conditions.i++;
        }

        return conditions;
    }

}