import { QueryResult, QueryResultRow } from "pg";
import { ReactionGroup, ReactionGroupTableSpecification } from "../../../../nodes/ReactionGroup";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";

/**
 * command to load a list of components
 */
export class LoadReactionsCommand extends LoadSyncNodeListCommand<ReactionGroup> {

    /**
     * Select only reaction groups that match this regex
     */
    public reaction?: string;

    /**
     * Select only reaction groups that include one of these users
     */
    public users?: string[];

    /**
     * Select only reaction groups that belong to one of the given origins
     */
    public ofOrigin?: string[];

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
        return new ReactionGroup(databaseManager, resultRow.id, resultRow.origin, resultRow.reaction, resultRow.users, resultRow.created_by, resultRow.created_at, resultRow.deleted, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT DISTINCT ON (id) id as distinct_id, ${this.rows} FROM (SELECT ${this.rows}, generate_subscripts(users,1) as i FROM issue_reactiongroup) as main `,
            values: []
        }
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
                text: `main.reaction ~ $${conditions.i}`,
                values: [this.reaction],
                priority: 4
            });
            conditions.i++;
        }

        if (this.ofOrigin !== undefined) {
            if (this.ofOrigin.length === 1) {
                conditions.conditions.push({
                    text: `main.origin=$${conditions.i}`,
                    values: [this.ofOrigin[0]],
                    priority: 5
                });
            } else {
                conditions.conditions.push({
                    text: `main.origin=ANY($${conditions.i})`,
                    values: [this.ofOrigin],
                    priority: 5
                });
            }
            conditions.i++;
        }

        if (this.users !== undefined) {
            if (this.users.length === 1) {
                conditions.conditions.push({
                    text: `main.users[i]=$${conditions.i}`,
                    values: [this.users[0]],
                    priority: 6
                });
            } else {
                conditions.conditions.push({
                    text: `main.users[i]=ANY($${conditions.i})`,
                    values: [this.users],
                    priority: 6
                });
            }
            conditions.i++;
        }

        return conditions;
    }

}