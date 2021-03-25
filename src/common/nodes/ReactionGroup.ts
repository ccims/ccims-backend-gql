import { config } from "../../config/Config";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { LoadCommentsCommand } from "../database/commands/load/nodes/timeline/LoadCommentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Issue } from "./Issue";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { SyncMetadata } from "./SyncMetadata";
import { SyncNode, SyncNodeTableSpecification } from "./SyncNode";
import { Body } from "./timelineItems/Body";
import { Comment } from "./timelineItems/Comment";
import { IssueComment } from "./timelineItems/IssueComment";
import { User } from "./User";

/**
 * The table specification for ReactionGroup
 */
export const ReactionGroupTableSpecification: NodeTableSpecification<ReactionGroup> =
    new NodeTableSpecification<ReactionGroup>("issue_reactiongroup", SyncNodeTableSpecification,
        RowSpecification.fromProperty("origin", "originCommentId"),
        RowSpecification.fromProperty("reaction", "reaction"),
        RowSpecification.fromProperty("users", "userIds"));

/**
 * Represents a group of users who reacted with the same reaction to a specific comment
 */
export class ReactionGroup extends SyncNode {

    /**
     * The id of the origin comment of this reaction group
     */
    private _originComment: string;

    /**
     * The name of the reaction of this group
     */
    private _reactionName: string;

    /**
     * All user ids of users who reacted to the origin with the reaction
     */
    private _users: Set<string>;

    /**
     * Create a `ReactionGroup` object for an existing reaction group in the database
     */
    public constructor(databaseManager: DatabaseManager, id: string, originComment: string, reactionName: string, users: string[], createdById: string | undefined, createdAt: Date,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.ReactionGroup, databaseManager, ReactionGroupTableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this._originComment = originComment;
        this._reactionName = reactionName;
        this._users = new Set(users);
    }

    /**
     * Creates a NEW reaction group for a comment
     *
     * @param databaseManager The database manager to use
     * @param originComment The comment for which this reaction group is
     * @param reactionName The name of the reaction
     * @param users All users that wil be added to the reaction group after initialization
     * @param createdById The creator user id of the creator of the reaction group
     * @param createdAt The date the group was created
     */
    public static create(databaseManager: DatabaseManager, originComment: string, reactionName: string, users: string[], createdById: string | undefined, createdAt: Date) {
        if (!originComment || !reactionName || !users) {
            throw new Error("Illegal reaction group creation parameters");
        }
        const group = new ReactionGroup(databaseManager, databaseManager.idGenerator.generateString(), originComment, reactionName, users, createdById, createdAt, false, new Date());
    }

    /**
     * The id of the origin comment of this reaction group
     */
    public get originCommentId(): string {
        return this._originComment;
    }

    /**
     * Sets a new origin for the reaction group
     *
     * @param id The id of the issue or issue comment to be set as new origin
     */
    public async setOriginCommentId(id: string) {
        if (!id) {
            throw new Error("The comment id must be set");
        }
        const commentCmd = new LoadCommentsCommand();
        commentCmd.ids = [id];
        this._databaseManager.addCommand(commentCmd);
        await this._databaseManager.executePendingCommands();
        let result = commentCmd.getResult();
        if (!result || result.length !== 1) {
            const issueCmd = new LoadIssuesCommand();
            issueCmd.ids = [id];
            this._databaseManager.addCommand(commentCmd);
            await this._databaseManager.executePendingCommands();
            result = commentCmd.getResult();
        }
        if (!result || result.length !== 1) {
            throw new Error("The give id didn't belong to either an issue or a comment");
        }
        await this.setOriginComment(result[0])
    }

    /**
     * Sets a new origin for the reaction group
     *
     * @param comment The issue comment or issue to be set as origin of the reaction group
     */
    public async setOriginComment(comment: IssueComment | Issue) {
        if (!comment) {
            throw new Error("The comment can't be undefined");
        }
        let commentObj: Comment;
        if (comment instanceof Issue) {
            commentObj = await comment.bodyProperty.getPublic();
        } else if (comment instanceof IssueComment) {
            commentObj = comment;
        } else {
            throw new Error("Only a comment or an issue can be set as origin for a reaction group");
        }
        this.markChanged();
        this._originComment = commentObj.id;
    }

    /**
     * The issue comment or issue this reaction group belongs to
     */
    public async originComment(): Promise<IssueComment | Issue> {
        const cmd = new LoadCommentsCommand();
        cmd.ids = [this._originComment];
        this._databaseManager.addCommand(cmd);
        await this._databaseManager.executePendingCommands();
        const result = cmd.getResult();
        if (!result || result.length !== 1) {
            throw new Error("The currently set origin id is no valid comment/issue");
        }
        if (result[0] instanceof IssueComment) {
            return result[0];
        } else if (result[0] instanceof Body) {
            return result[0].issue();
        } else {
            throw new Error("The currently set origin id is no valid comment/issue");
        }
    }

    /**
     * The reaction name of this reaction group
     */
    public get reaction(): string {
        return this._reactionName;
    }

    /**
     * The reaction name of this reaction group
     */
    public set reaction(reaction: string) {
        if (!reaction || reaction.length <= 0) {
            throw new Error("The reaction name can't be empty or undefined");
        }
        if (reaction !== this._reactionName) {
            this.markChanged();
            this._reactionName = reaction;
        }
    }

    /**
     * Returns the ids of all reacting users
     */
    public get userIds(): string[] {
        return Array.from(this._users);
    }

    /**
     * Add a new user who reacted in this group
     *
     * @param user The user to be added as new user reacting
     */
    public addUser(user: User) {
        if (!user) {
            throw new Error("User to add can't be undefined");
        }
        if (!this._users.has(user.id)) {
            this.markChanged();
            this._users.add(user.id);
        }
    }

    /**
     * Remove the given user from this reaction group
     *
     * @param user The user to be removed from the list of users who reacted
     */
    public removeUser(user: User) {
        if (!user) {
            throw new Error("User to remove can't be undefined");
        }
        if (this._users.has(user.id)) {
            this.markChanged();
            this._users.delete(user.id);
        }
    }

    /**
     * Async getter function for the users who are part of this reaction group
     *
     * __NOTE__: This will potentially only return a subset of users (as many as specified in `config.api.numReactionUsers`)
     * For the total count please use the `totalUserCount` function
     */
    public async users(): Promise<User[]> {
        const usersToReturn = this.userIds.slice(0, config.api.numReactionUsers);
        const cmd = new LoadUsersCommand();
        cmd.ids = usersToReturn;
        this._databaseManager.addCommand(cmd);
        await this._databaseManager.executePendingCommands();
        return cmd.getResult();
    }

    /**
     * Returns the total number of users who reacted
     */
    public get totalUserCount(): number {
        return this._users.size;
    }

}