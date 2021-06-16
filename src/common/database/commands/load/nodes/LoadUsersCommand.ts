import { User } from "../../../../nodes/User";
import { QueryPart } from "../QueryPart";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";
import { createRelationFilterByPrimary, createRelationFilterOnMany, createStringListFilter } from "./RelationFilter";

/**
 * command to load users
 */
export class LoadUsersCommand extends LoadMultipleNodeListsCommand<User> {

    /**
     * select only users that have a username that matches the given posix RegEx
     */
    public username: string | undefined;

    /**
     * select only users that have a display name that matches the given posix RegEx
     */
    public displayName: string | undefined;

    /**
     * selects only users for which display name or username contains the specified serach text
     * case insensitive, no regex support
     */
    public searchText: string | undefined;

    /**
     * select only users that have an email that matches the given posix RegEx
     */
    public email: string | undefined;

    /**
     * select only users that are assigned to one of the given issues
     */
    public assignedToIssues: string[] | undefined;

    /**
     * select only users that are a participant of one ofthe given issues
     */
    public participantOfIssues: string[] | undefined;

    /**
     * select only users that created/edited at least one of the given comments
     */
    public editedComments: string[] | undefined;

    /**
     * selects only Users that added at least one of the specified ReactionGroups to any comment
     */
    public reactions: string[] | undefined;

    /**
     * selects only users that are linked by at least one of the given users
     */
    public linkedByUsers: string[] | undefined;

    /**
     * selects only users that link to at least one of the given
     */
    public linksToUsers: string[] | undefined;

    /**
     * If true the linked users are loaded instread of the actual user
     * defaults to false
     */
    public loadLinkedUsers: boolean = false;

    /**
     * creates a new LoadUsersCommand
     */
    public constructor() {
        super("users");
    }


    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
     protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.username !== undefined) {
            conditions.conditions.push({
                text: `main.username ~* $${conditions.i}`,
                values: [this.username],
            });
            conditions.i++;
        }

        if (this.displayName !== undefined) {
            conditions.conditions.push({
                text: `main.displayname ~* $${conditions.i}`,
                values: [this.displayName],
            });
            conditions.i++;
        }

        if (this.searchText !== undefined) {
            const search = this.searchText.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
            conditions.conditions.push({
                text: `(main.username LIKE $${conditions.i} OR main.displayname LIKE $${conditions.i})`,
                values: [`%${search}%`]
            });
            conditions.i++;
        }

        if (this.email !== undefined) {
            conditions.conditions.push({
                text: `main.email ~* $${conditions.i}`,
                values: [this.email],
            });
            conditions.i++;
        }

        const linkedConditions = this.generateLinkedConditions(conditions.i);
        if (linkedConditions.conditions.length > 0) {
            if (this.loadLinkedUsers) {
                const values = [];
                for (const conditionSpecification of linkedConditions.conditions) {
                    values.push(...conditionSpecification.values);
                }
                const linkedConditionsText = linkedConditions.conditions.map(spec => `(${spec.text})`).join(" AND ");
                conditions.conditions.push({
                    text: `main.id = ANY(SELECT id FROM users WHERE ${linkedConditionsText})`,
                    values: values,
                });
            } else {
                conditions.conditions.push(...linkedConditions.conditions);
            }
            conditions.i = linkedConditions.i;
        }

        return conditions;
    }

    /**
     * Generates the linked conditions, a list of conditions that must be applied to the not linked users
     * @param i the start value index
     * @returns the generated conditions
     */
    private generateLinkedConditions(i: number): { conditions: QueryPart[], i: number} {
        const conditions = {
            conditions: [] as QueryPart[],
            i: i
        };

        if (this.assignedToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "assignee", this.assignedToIssues, conditions.i));
            conditions.i++;
        }

        if (this.participantOfIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "participant", this.participantOfIssues, conditions.i));
            conditions.i++;
        }

        if (this.editedComments !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("comment", "editedBy", this.editedComments, conditions.i));
            conditions.i++;
        }

        if (this.reactions !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("reaction_group", "user", this.reactions, conditions.i));
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