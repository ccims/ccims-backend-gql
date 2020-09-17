import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { User, UserTableSpecification } from "../../../../nodes/User";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryResultRow, QueryResult } from "pg";
import { UserPermissions } from "../../../../../utils/UserPermissions";
import { QueryPart } from "../QueryPart";
import { ConditionSpecification } from "../ConditionSpecification";
import { createRelationFilterByPrimary, createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load a list of projects
 */
export class LoadUsersCommand extends LoadNodeListCommand<User> {

    /**
     * select only users that are participant of at least on of the given projects
     */
    public onProjects?: string[];


    /**
     * select only users that have one of the usernames in this array
     */
    public onUsernames?: string[];

    /**
     * creates a new LoadUsersCommand
     */
    public constructor() {
        super(UserTableSpecification.rows);
    }

    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): User {
        return new User(databaseManager, resultRow["id"], resultRow["username"], resultRow["displayname"], resultRow["pw_hash"], new UserPermissions(resultRow["pw_hash"]), resultRow["email"]);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM users main`,
            values: []
        }
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onProjects) {
            conditions.conditions.push(createRelationFilterBySecundary("user", "project", this.onProjects, conditions.i));
            conditions.i++;
        }

        if (this.onUsernames) {
            if (this.onUsernames.length == 1) {
                conditions.conditions.push({
                    text: `username=$${conditions.i}`,
                    values: [this.onUsernames],
                    priority: 5
                });
            } else {
                conditions.conditions.push({
                    text: `username=ANY($${conditions.i})`,
                    values: [this.onUsernames],
                    priority: 5
                });
            }
            conditions.i++;
        }
        return conditions;
    }

}