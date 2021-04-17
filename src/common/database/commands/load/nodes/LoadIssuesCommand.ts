import { QueryResultRow, QueryResult } from "pg";
import { IssueCategory } from "../../../../nodes/enums/IssueCategory";
import { Issue, IssueTableSpecification } from "../../../../nodes/Issue";
import { Body, BodyTableSpecification } from "../../../../nodes/timelineItems/Body";
import { DatabaseManager } from "../../../DatabaseManager";
import { OrConditionSpecification } from "../OrConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary, createStringListFilter } from "./RelationFilter";

export class LoadIssuesCommand extends LoadSyncNodeListCommand<Issue> {

    /**
     * Select only issues of which the title matches this regex
     */
    public title: string | undefined;

    /**
     * Selects issues of which the title or body matches the given text regex or which 
     * have at least on of the specified labels
     */
    public fullSearch: FullSearch | undefined;

    /**
     * Select only issues which are on one of these components
     */
    public onComponents: string[] | undefined;

    /**
     * Select only issues which are on any component on one of these projects
     */
    public onProjects: string[] | undefined;

    /**
     * Select only issues when their body matches this regex
     */
    public body: string | undefined;

    /**
     * Select only issues which were edited by one of these users
     */
    public editedBy: string[] | undefined;

    /**
     * Select only issues that were last edited after the given date (inclusive)
     * Only including edits to the issues body
     */
    public lastEditedAfter: Date | undefined;

    /**
     * Select only issues that were last edited before the given date (inclusive)
     * Only including edits to the issues body
     */
    public lastEditedBefore: Date | undefined;

    /**
     * Select only issues that were last updated after the given date (inclusive)
     * This includes any changes to the issue or its comments
     */
    public lastUpdatedAfter: Date | undefined;

    /**
     * Select only issues that were last updated before the given date (inclusive)
     * This includes any changes to the issue or its comments
     */
    public lastUpdatedBefore: Date | undefined;

    /**
     * If set and `true`, only issues that are open are selected. If `false`, only closed issue
     */
    public isOpen: boolean | undefined;

    /**
     * If set and `true`, only issues that are a duplicate of another issue are selected. If `false`, only issues which are not marked as duplicate
     */
    public isDuplicate: boolean | undefined;

    /**
     * filters for issues where any of the users is assigned
     */
    public userAssigned: string[] | undefined;

    /**
     * filter for issues with one of the specified categories
     */
    public ofCategory: IssueCategory[] | undefined

    /**
     * Select only issues linking __to__ one of the given issues (origin of the relation)
     */
    public linksToIssues: string[] | undefined;

    /**
     * Select only issues __being linked to__ one of the given issues (destination of the relation)
     */
    public linkedByIssues: string[] | undefined;

    /**
     * Select only issues, that link to at least one other issue
     */
    public linksToAnyIssues: boolean | undefined;

    /**
     * Select only issues, that are linked by at least one other issue
     */
    public linkedByAnyIssues: boolean | undefined;

    /**
     * Select only issues that have all of the reactions in one of the given list entries on their body
     * TODO
     */
    public reactions: string[][] | undefined;

    /**
     * Select only issues that have one of these labels assigned
     */
    public labels: string[] | undefined;

    /**
     * Select only issues that have one of these Artifacts assigned
     */
    public artifacts: string[] | undefined;

    /**
     * filters for issues where any of the users perticipated
     */
    public userParticipated: string[] | undefined;

    /**
     * Select only issues that are assigned to at least one of these locations
     */
    public onLocations: string[] | undefined;

    /**
     * If set and `true`, only issues that the current user is allowed to edit the body on will be selected. If `false` only those where he isn't.
     * TODO
     */
    public currentUserCanEdit: boolean | undefined;

    /**
     * If set and `true`, only issues that the current user is allowed to comment on will be selected. If `false` only those where he isn't.
     * TODO
     */
    public currentUserCanComment: boolean | undefined;

    /**
     * Select only issues that have a start date after this date (inclusive)
     */
    public startDateAfter: Date | undefined;

    /**
     * Select only issues that have a start date before this date (inclusive)
     */
    public startDateBefore: Date | undefined;

    /**
     * Select only issues that have a due date after this date (inclusive)
     */
    public dueDateAfter: Date | undefined;

    /**
     * Select only issues that have a due date before this date (inclusive)
     */
    public dueDateBefore: Date | undefined;

    /**
     * Select only issues that have an estimated time which is at __least__ the given time span in milliseconds (inclusive)
     */
    public estimatedTimeGreaterThan: number | undefined;

    /**
     * Select only issues that have an estimated time which is at __most__ the given time span in milliseconds (inclusive)
     */
    public estimatedTimeLowerThan: number | undefined;

    /**
     * Select only issues that have an spent time which is at __least__ the given time span in milliseconds (inclusive)
     */
    public spentTimeGreaterThan: number | undefined;

    /**
     * Select only issues that have an spent time which is at __most__ the given time span in milliseconds (inclusive)
     */
    public spentTimeLowerThan: number | undefined;

    /**
     * Selects only issues which have been modified after the given date (__inclusive__)
     * This also includes issues where the timeline has been modified
     * 
     */
    public issueOrTimelineModifiedSince: Date | undefined;

    public constructor(loadDeleted: boolean = false) {
        super(IssueTableSpecification.rows, loadDeleted);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Issue {
        let body = databaseManager.getCachedNode(resultRow.body_id) as Body | undefined;
        if (body === undefined) {
            body = new Body(databaseManager, resultRow.body_id, resultRow.body_created_by_id, resultRow.body_created_at, resultRow.body_issue,
                resultRow.body_body, resultRow.body_last_edited_by, resultRow.body_last_edited_at, resultRow.body_initial_title, resultRow.body_deleted,
                resultRow.body_last_modified_at, resultRow.body_metadata);
            databaseManager.addCachedNode(body);
        }
        return new Issue(databaseManager, body, resultRow.id, resultRow.created_by_id, resultRow.created_at, resultRow.title, resultRow.is_open, resultRow.is_duplicate,
            resultRow.category, resultRow.start_date, resultRow.due_date, resultRow.estimated_time, resultRow.spent_time, resultRow.last_updated_at,
            resultRow.body_id, resultRow.priority, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * gets a string with all rows that should be selected
     * Also selects the necessary rows from body to load the Body
     */
    protected rows(databaseManager: DatabaseManager): string {
        if (!this.countMode) {
            let bodyRows = BodyTableSpecification.rows
                .map(row => row.rowName)
                .filter(name => name != "id")
                .map(name => `body.${name} AS body_${name}`)
                .join(", ");
            bodyRows += ", body.last_modified_at AS body_last_modified_at";
            if (databaseManager.metadataId !== undefined) {
                bodyRows += ", body_metadata.metadata AS body_metadata";
            }
            return `${super.rows(databaseManager)}, ${bodyRows}`;
        } else {
            return super.rows(databaseManager);
        }
    }

    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
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
            conditions.conditions.push(createStringListFilter("category", this.ofCategory, conditions.i));
            conditions.i++;
        }
        if (this.onComponents !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "issue", this.onComponents, conditions.i));
            conditions.i++;
        }
        if (this.onLocations !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue_location", "issue", this.onLocations, conditions.i));
            conditions.i++;
        }
        if (this.onProjects !== undefined) {
            if (this.onProjects.length === 1) {
                conditions.conditions.push({
                    text: `main.component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${conditions.i})`,
                    values: [this.onProjects[0]]
                });
            } else {
                conditions.conditions.push({
                    text: `main.component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${conditions.i}))`,
                    values: [this.onProjects[0]]
                });
            }
            conditions.i++;
        }
        if (this.editedBy !== undefined) {
            if (this.editedBy.length === 1) {
                conditions.conditions.push({
                    text: `EXISTS(SELECT 1 FROM relation_comment_edited_by WHERE comment_id=main.id AND edited_by_id=$${conditions.i})`,
                    values: [this.editedBy[0]]
                });
            } else {
                conditions.conditions.push({
                    text: `EXISTS(SELECT 1 FROM relation_comment_edited_by WHERE comment_id=main.id AND edited_by_id=ANY($${conditions.i}))`,
                    values: [this.editedBy]
                });
            }
            conditions.i++;
        }
        if (this.lastEditedBefore !== undefined) {
            conditions.conditions.push({
                text: `EXISTS(SELECT 1 FROM body WHERE issue=main.id AND last_edited_at <= $${conditions.i})`,
                values: [this.lastEditedBefore]
            });
            conditions.i++;
        }
        if (this.lastEditedAfter !== undefined) {
            conditions.conditions.push({
                text: `EXISTS(SELECT 1 FROM body WHERE issue=main.id AND last_edited_at >= $${conditions.i})`,
                values: [this.lastEditedAfter]
            });
            conditions.i++;
        }
        if (this.title !== undefined) {
            conditions.conditions.push({
                text: `main.title ~* $${conditions.i}`,
                values: [this.title],
            });
            conditions.i++;
        }
        if (this.body !== undefined) {
            conditions.conditions.push({
                text: `EXISTS(SELECT 1 FROM body WHERE issue=main.id AND body ~* $${conditions.i})`,
                values: [this.body],
            });
            conditions.i++;
        }
        if (this.fullSearch !== undefined) {
            let orConditions: QueryPart[] = [];
            if (this.fullSearch.text !== undefined) {
                orConditions.push({
                    text: `main.title ~* $${conditions.i}`,
                    values: [this.fullSearch.text],
                });
                orConditions.push({
                    text: `EXISTS(SELECT 1 FROM body WHERE issue=main.id AND body ~* $${conditions.i + 1})`,
                    values: [this.fullSearch.text],
                });
                conditions.i += 2;
            }
            if (this.fullSearch.labels !== undefined) {
                orConditions.push(createRelationFilterBySecundary("issue", "label", this.fullSearch.labels, conditions.i));
                conditions.i++;
            }
            conditions.conditions.push(new OrConditionSpecification(...orConditions));
        }
        if (this.lastUpdatedAfter !== undefined) {
            conditions.conditions.push({
                text: `main.last_updated_at>=$${conditions.i}`,
                values: [this.lastUpdatedAfter],
            });
            conditions.i++;
        }
        if (this.lastUpdatedBefore !== undefined) {
            conditions.conditions.push({
                text: `main.last_updated_at<=$${conditions.i}`,
                values: [this.lastUpdatedBefore],
            });
            conditions.i++;
        }
        if (this.isOpen !== undefined) {
            conditions.conditions.push({
                text: `main.is_open = $${conditions.i}`,
                values: [this.isOpen],
            });
            conditions.i++;
        }
        if (this.isDuplicate !== undefined) {
            conditions.conditions.push({
                text: `main.isDuplicate = $${conditions.i}`,
                values: [this.isDuplicate],
            });
            conditions.i++;
        }
        if (this.linkedByIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "linked_issue", this.linkedByIssues, conditions.i));
            conditions.i++;
        }
        if (this.linksToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "linked_issue", this.linksToIssues, conditions.i));
            conditions.i++;
        }
        if (this.linksToAnyIssues !== undefined) {
            if (this.linksToAnyIssues) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT issue_id FROM relation_issue_linked_issue)`,
                    values: [],
                });
            } else {
                conditions.conditions.push({
                    text: `main.id!=ANY(SELECT issue_id FROM relation_issue_linked_issue)`,
                    values: [],
                });
            }
        }
        if (this.linkedByAnyIssues !== undefined) {
            if (this.linksToAnyIssues) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT linked_issue_id FROM relation_issue_linked_issue)`,
                    values: [],
                });
            } else {
                conditions.conditions.push({
                    text: `main.id!=ANY(SELECT linked_issue_id FROM relation_issue_linked_issue)`,
                    values: [],
                });
            }
        }
        if (this.labels !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "label", this.labels, conditions.i));
            conditions.i++;
        }
        if (this.artifacts !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "artifact", this.artifacts, conditions.i));
            conditions.i++;
        }
        if (this.startDateAfter !== undefined) {
            conditions.conditions.push({
                text: `main.start_date>=$${conditions.i}`,
                values: [this.startDateAfter],
            });
            conditions.i++;
        }
        if (this.startDateBefore !== undefined) {
            conditions.conditions.push({
                text: `main.start_date<=$${conditions.i}`,
                values: [this.startDateBefore],
            });
            conditions.i++;
        }
        if (this.dueDateAfter !== undefined) {
            conditions.conditions.push({
                text: `main.due_date>=$${conditions.i}`,
                values: [this.dueDateAfter],
            });
            conditions.i++;
        }
        if (this.dueDateBefore !== undefined) {
            conditions.conditions.push({
                text: `main.due_date<=$${conditions.i}`,
                values: [this.dueDateBefore],
            });
            conditions.i++;
        }

        if (this.estimatedTimeGreaterThan !== undefined) {
            conditions.conditions.push({
                text: `main.estimated_time>=$${conditions.i}`,
                values: [this.estimatedTimeGreaterThan],
            });
            conditions.i++;
        }
        if (this.estimatedTimeLowerThan !== undefined) {
            conditions.conditions.push({
                text: `main.estimated_time<=$${conditions.i}`,
                values: [this.estimatedTimeLowerThan],
            });
            conditions.i++;
        }
        if (this.spentTimeGreaterThan !== undefined) {
            conditions.conditions.push({
                text: `main.spent_time>=$${conditions.i}`,
                values: [this.spentTimeGreaterThan],
            });
            conditions.i++;
        }
        if (this.spentTimeLowerThan !== undefined) {
            conditions.conditions.push({
                text: `main.spent_time<=$${conditions.i}`,
                values: [this.spentTimeLowerThan],
            });
            conditions.i++;
        }

        if (this.issueOrTimelineModifiedSince !== undefined) {
            conditions.conditions.push({
                text: `((main.last_modified_at >= $${conditions.i}) OR main.id=ANY(SELECT issue_id FROM issue_timeline_item WHERE last_modified_at >= $${conditions.i}))`,
                values: [this.issueOrTimelineModifiedSince]
            })
        }

        return conditions;
    }

    /**
     * Generates a default query start QueryPart from a tablename and the databaseManager
     * Can be overwritten to implement node specific behaviour
     * Uses main as default alias for the table that is queried
     * If a metadataId is set, metadata is queried, metadata is the table name
     * WARNING: only use constants for tableName!
     * @param tableName the name of the table to query from
     * @param databaseManager the database manager
     */
    protected generateQueryStartFromTableName(tableName: string, databaseManager: DatabaseManager): QueryPart {
        const metadataId = databaseManager.metadataId;
        if (metadataId === undefined) {
            return {
                text: `SELECT ${this.rows(databaseManager)} FROM ${tableName} main LEFT JOIN body ON (main.body_id = body.id) `,
                values: []
            }
        } else {
            return {
                text: `SELECT ${this.rows(databaseManager)} FROM ${tableName} main LEFT JOIN metadata metadata ON (main.id = metadata.node_id AND metadata.id = $1) LEFT JOIN body ON (main.body_id = body.id) LEFT JOIN metadata body_metadata ON (body.id = body_metadata.node_id AND body_metadata.id = $1) `,
                values: [metadataId]
            }
        }
    }

}

export interface FullSearch {
    labels?: string[],
    text?: string
}