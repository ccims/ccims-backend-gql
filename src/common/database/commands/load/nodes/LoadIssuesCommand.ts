import { QueryResultRow, QueryResult } from "pg";
import { Issue, IssueCategory, IssueTableSpecification } from "../../../../nodes/Issue";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createRelationFilterBySecundary, createStringListFilter } from "./RelationFilter";

export class LoadIssuesCommand extends LoadSyncNodeListCommand<Issue> {

    /**
     * filters for issues where any of the users perticipated
     */
    public userParticipated?: string[];

    /**
     * filters for issues where any of the users is assigned
     */
    public userAssigned?: string[];

    /**
     * filter for issues with one of the specified categories
     */
    public ofCategory?: IssueCategory[]

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
        if (this.userAssigned) {
            conditions.conditions.push(createRelationFilterBySecundary("issue", "assignee", this.userAssigned, conditions.i));
            conditions.i++;
        }
        if (this.ofCategory) {
            conditions.conditions.push(createStringListFilter("category", this.ofCategory, conditions.i, 5));
            conditions.i++;
        }

        return conditions;
    }
    
}