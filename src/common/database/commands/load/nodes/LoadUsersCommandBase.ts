import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { User, UserTableSpecification } from "../../../../nodes/User";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryResultRow, QueryResult } from "pg";
import { UserPermissions } from "../../../../../utils/UserPermissions";
import { QueryPart } from "../QueryPart";
import { ConditionSpecification } from "../ConditionSpecification";
import { createRelationFilterByPrimary, createRelationFilterBySecundary, createRelationFilterOnMany, createStringListFilter } from "./RelationFilter";

/**
 * base command to load a list of users
 */
export abstract class LoadUsersCommandBase<T extends User> extends LoadNodeListCommand<T> {

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
     * selects only users that are linked by at least one of the given users
     */
    public linkedByUsers?: string[];

    /**
     * selects only users that link to at least one of the given
     */
    public linksToUsers?: string[];

    /**
     * creates a new LoadUsersCommand
     */
    public constructor() {
        super(UserTableSpecification.rows);
    }


    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("users", databaseManager);
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

        if (this.linkedByUsers !== undefined) {
            conditions.conditions.push(createRelationFilterOnMany("users", "linked_user_id", this.linkedByUsers, conditions.i))
            conditions.i++;
        }

        if (this.linksToUsers !== undefined) {
            conditions.conditions.push(createStringListFilter("linked_user_id", this.linksToUsers, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}