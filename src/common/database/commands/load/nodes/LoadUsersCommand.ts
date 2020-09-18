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
    public onUsername?: string;

    /**
     * select only users that have a display name that matches the given posix RegEx
     */
    public onDisplayName?: string;

    /**
     * select only users that have an email that matches the given posix RegEx
     */
    public onEmail?: string;

    /**
     * select only users that are participant of at least on of the given projects
     */
    public onProjects?: string[];

    /**
     * select only users that are assigned to one of the given issues
     */
    public onAssignedToIssues?: string[];

    /**
     * select only users that are a participant of one ofthe given issues
     */
    public onParticipantOfIssue?: string[];

    /**
     * select only users that created aat leas one of the given comments
     */
    public onComments?: string[];

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

        if (this.onUsername) {
            conditions.conditions.push({
                text: `main.username ~ $${conditions.i}`,
                values: [this.onUsername],
                priority: 5
            });
            conditions.i++;
        }

        if (this.onDisplayName) {
            conditions.conditions.push({
                text: `main.displayname ~ $${conditions.i}`,
                values: [this.onDisplayName],
                priority: 5
            });
            conditions.i++;
        }

        if (this.onEmail) {
            conditions.conditions.push({
                text: `main.email ~ $${conditions.i}`,
                values: [this.onEmail],
                priority: 5
            });
            conditions.i++;
        }

        if (this.onProjects) {
            conditions.conditions.push(createRelationFilterBySecundary("user", "project", this.onProjects, conditions.i));
            conditions.i++;
        }

        if (this.onAssignedToIssues) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "assignee", this.onAssignedToIssues, conditions.i));
            conditions.i++;
        }

        if (this.onParticipantOfIssue) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "participant", this.onParticipantOfIssue, conditions.i));
            conditions.i++;
        }

        if (this.onComments) {
            conditions.conditions.push(createRelationFilterByPrimary("comment", "editedBy", this.onComments, conditions.i));
            conditions.i++;
        }
        return conditions;
    }

}