import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { LoadCommentIssueTimelineItemsCommand } from "../database/commands/load/nodes/timeline/LoadCommentIssueTimelineItemsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Issue } from "./Issue";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { Body } from "./timelineItems/Body";
import { CommentIssueTimelineItem } from "./timelineItems/CommentIssueTimelineItem";
import { IssueComment } from "./timelineItems/IssueComment";
import { User } from "./User";

/**
 * The table specification for ReactionGroup
 */
export const ReactionGroupTableSpecification: NodeTableSpecification<ReactionGroup> =
    new NodeTableSpecification<ReactionGroup>("reaction_group", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("reaction", "reaction"),
        );

/**
 * Represents a group of users who reacted with the same reaction to a specific comment
 */
export class ReactionGroup extends CCIMSNode {

    /**
     * Property with the comment which has this ReactionGroup
     * Warning: this is an IssueComment or a Body
     * this does NOT redirect to the Issue in case of Body!
     */
    public readonly commentProperty: NullableNodeProperty<CommentIssueTimelineItem, ReactionGroup>;

    /**
     * specification for commentProperty
     */
    private static readonly commentPropertySpecification: NodePropertySpecification<CommentIssueTimelineItem, ReactionGroup>
        = new NodePropertySpecification<CommentIssueTimelineItem, ReactionGroup>(
            (id, reactionGroup) => {
                const command = new LoadCommentIssueTimelineItemsCommand(true);
                command.ids = [id];
                return command;
            },
            reactionGroup => new GetWithReloadCommand(reactionGroup, "comment_id", new LoadCommentIssueTimelineItemsCommand(true))
            //no update, because cannot be changed
        );

    /**
     * Property with all users who added this reaction
     */
    public readonly usersProperty: NodeListProperty<User, ReactionGroup>;

    /**
     * specification for usersProperty
     */
    private static readonly usersPropertySpecification: NodeListPropertySpecification<User, ReactionGroup>
        = NodeListPropertySpecification.loadDynamic<User, ReactionGroup>(
            LoadRelationCommand.fromPrimary("reaction_group", "user"),
            (ids, reactionGroup) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            reactionGroup => {
                const command = new LoadUsersCommand();
                command.reactions = [reactionGroup.id];
                return command;
            })
            .notifyChanged((user, reactionGroup) => user.reactionsProperty)
            .saveOnPrimary("reaction_group", "user");

    /**
     * The reaction of this group
     */
    private _reaction: string;

    /**
     * Create a `ReactionGroup` object for an existing reaction group in the database
     */
    public constructor(databaseManager: DatabaseManager, id: string, commentId: string, reaction: string) {
        super(NodeType.ReactionGroup, databaseManager, ReactionGroupTableSpecification, id);
        this._reaction = reaction;
        this.commentProperty = new NullableNodeProperty<CommentIssueTimelineItem, ReactionGroup>(databaseManager, ReactionGroup.commentPropertySpecification, this, commentId);
        this.usersProperty = new NodeListProperty<User, ReactionGroup>(databaseManager, ReactionGroup.usersPropertySpecification, this);
    }

    /**
     * Creates a NEW reaction group for a comment
     *
     * @param databaseManager The database manager to use
     * @param originComment The comment for which this reaction group is
     * @param reactionName The name of the reaction
     * @param users All users that wil be added to the reaction group after initialization
     */
    public static create(databaseManager: DatabaseManager, originComment: string, reactionName: string, users: string[]) {
        if (!originComment || !reactionName || !users) {
            throw new Error("Illegal reaction group creation parameters");
        }
        const group = new ReactionGroup(databaseManager, databaseManager.idGenerator.generateString(), originComment, reactionName);
    }

    /**
     * The issue comment or issue this reaction group belongs to
     */
    public async comment(): Promise<IssueComment | Issue | undefined> {
        const commentTimelineItem =  await this.commentProperty.get();
        if (commentTimelineItem?.type === NodeType.Body) {
            return (commentTimelineItem as Body).issue();
        } else {
            return commentTimelineItem;
        }
    }

    /**
     * Returns the reaction this ReactionGroup represents
     */
    public get reaction(): string {
        return this._reaction;
    }

}