import { QueryResult, QueryResultRow } from "pg";
import { ReactionGroup, ReactionGroupTableSpecification } from "../../../../nodes/ReactionGroup";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createRelationFilterBySecundary, createStringListFilter } from "./RelationFilter";

/**
 * command to load a list of components
 */
export class LoadReactionGroupsCommand extends LoadNodeListCommand<ReactionGroup> {

    /**
     * Select only reaction groups that match this regex
     */
    public reaction?: string;

    /**
     * Select only reaction groups that include one of these users
     */
    public users?: string[];

    /**
     * Select only ReactionGroups that are part of at least on of the specified comments
     * NOTE: the Comment has to be a CommentIssueTimelineItem, Issues do NOT work
     */
    public onComments?: string[];

    /**
     * creates a new LoadReactionsCommand
     */
    public constructor() {
        super(ReactionGroupTableSpecification.rows);
    }

    /**
     * parses a component
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed component
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ReactionGroup {
        return new ReactionGroup(databaseManager, resultRow.id, resultRow.comment_id, resultRow.reaction);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("reaction_group", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.reaction !== undefined) {
            conditions.conditions.push({
                text: `main.reaction ~* $${conditions.i}`,
                values: [this.reaction],
                priority: 4
            });
            conditions.i++;
        }

        if (this.onComments !== undefined) {
            conditions.conditions.push(createStringListFilter("comment_id", this.onComments, conditions.i));
            conditions.i++;
        }

        if (this.users !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("reaction_group", "user", this.users, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}