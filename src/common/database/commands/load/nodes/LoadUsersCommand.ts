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
     * select only users that have a username that matches the given posix RegEx
     */
    public username?: string;

    /**
     * select only users that have a display name that matches the given posix RegEx
     */
    public displayName?: string;

    /**
     * select only users that have an email that matches the given posix RegEx
     */
    public email?: string;

    /**
     * select only users that are participant of at least on of the given projects
     */
    public onProjects?: string[];

    /**
     * select only users that are assigned to one of the given issues
     */
    public assignedToIssues?: string[];

    /**
     * select only users that are a participant of one ofthe given issues
     */
    public participantOfIssue?: string[];

    /**
     * select only users that created/edited at least one of the given comments
     */
    public editedComments?: string[];

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
        return new User(databaseManager, resultRow.id, resultRow.username, resultRow.displayname, resultRow.pw_hash, new UserPermissions(resultRow.permissions), resultRow.email);
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

        if (this.username !== undefined) {
            conditions.conditions.push({
                text: `main.username ~* $${conditions.i}`,
                values: [this.username],
                priority: 5
            });
            conditions.i++;
        }

        if (this.displayName !== undefined) {
            conditions.conditions.push({
                text: `main.displayname ~* $${conditions.i}`,
                values: [this.displayName],
                priority: 5
            });
            conditions.i++;
        }

        if (this.email !== undefined) {
            conditions.conditions.push({
                text: `main.email ~* $${conditions.i}`,
                values: [this.email],
                priority: 5
            });
            conditions.i++;
        }

        if (this.onProjects !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("user", "project", this.onProjects, conditions.i));
            conditions.i++;
        }

        if (this.assignedToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "assignee", this.assignedToIssues, conditions.i));
            conditions.i++;
        }

        if (this.participantOfIssue !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "participant", this.participantOfIssue, conditions.i));
            conditions.i++;
        }

        if (this.editedComments !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("comment", "editedBy", this.editedComments, conditions.i));
            conditions.i++;
        }
        return conditions;
    }

}