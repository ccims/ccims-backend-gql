import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../../database/commands/load/LoadRelationCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeListProperty } from "../properties/NodeListProperty";
import { NodeListPropertySpecification } from "../properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { Comment } from "../Comment";
import { ReactionGroup } from "../ReactionGroup";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
import MarkdownIt from "markdown-it";
import { config } from "../../../config/Config";
import { LoadReactionGroupsCommand } from "../../database/commands/load/nodes/LoadReactionGroupsCommand";

const mdRenderer = new MarkdownIt(config.markdown);

/**
 * a table specification for a Comment
 * does not specifiy the metadata, because this is up to the save method
 */
export const CommentIssueTimelineItemTableSpecification: NodeTableSpecification<CommentIssueTimelineItem>
    = new NodeTableSpecification<CommentIssueTimelineItem>("issue_timeline_item", IssueTimelineItemTableSpecification,
        RowSpecification.fromProperty("body", "body"),
        RowSpecification.fromProperty("last_edited_at", "lastEditedAt"),
        new RowSpecification("last_edited_by_id", comment => comment.lastEditedByProperty.getId()));

export class CommentIssueTimelineItem<T extends CommentIssueTimelineItem = any> extends IssueTimelineItem<T> implements Comment<T> {

    private _body: string;

    public readonly editedByProperty: NodeListProperty<User, CommentIssueTimelineItem>;

    private static readonly editedByPropertySpecification: NodeListPropertySpecification<User, CommentIssueTimelineItem>
        = NodeListPropertySpecification.loadDynamic<User, Comment>(
            LoadRelationCommand.fromPrimary("comment", "edited_by"),
            (ids, comment) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            comment => {
                const command = new LoadUsersCommand();
                command.editedComments = [comment.id];
                return command;
            })
            .notifyChanged((user, comment) => user.commentsProperty)
            .saveOnPrimary("comment", "edited_by");

    public readonly lastEditedByProperty: NullableNodeProperty<User, CommentIssueTimelineItem>;

    private static readonly lastEditedByPropertySpecification: NodePropertySpecification<User, CommentIssueTimelineItem>
        = new NodePropertySpecification<User, CommentIssueTimelineItem>(
            (id, comment) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            comment => new GetWithReloadCommand(comment, "last_edited_by_id", new LoadUsersCommand()),
        );

    private _lastEditedAt: Date;

    /**
     * Property with all reactions on this Comment
     */
    public readonly reactionsProperty: NodeListProperty<ReactionGroup, CommentIssueTimelineItem>;

    /**
     * specification for reactionsProperty
     */
    private static readonly reactionsPropertySpecification: NodeListPropertySpecification<ReactionGroup, CommentIssueTimelineItem> 
        = NodeListPropertySpecification.loadDynamic<ReactionGroup, CommentIssueTimelineItem>(
            LoadRelationCommand.fromManySide("reaction_group", "comment_id"),
            (ids, comment) => {
                const command = new LoadReactionGroupsCommand();
                command.ids = ids;
                return command;
            },
            comment => {
                const command = new LoadReactionGroupsCommand();
                command.onComments = [comment.id];
                return command;
            })
            .notifyChanged((reactionGroup, comment) => reactionGroup.commentProperty)
            .noSave();


    // TODO? currentUserCanEdit

    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, body: string, lastEditedById: string | undefined, lastEditedAt: Date,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);
        this._lastEditedAt = lastEditedAt;
        this._body = body;
        this.editedByProperty = new NodeListProperty<User, CommentIssueTimelineItem>(databaseManager, CommentIssueTimelineItem.editedByPropertySpecification, this);
        this.lastEditedByProperty = new NullableNodeProperty<User, CommentIssueTimelineItem>(databaseManager, CommentIssueTimelineItem.lastEditedByPropertySpecification, this, lastEditedById);
        this.reactionsProperty = new NodeListProperty<ReactionGroup, CommentIssueTimelineItem>(databaseManager, CommentIssueTimelineItem.reactionsPropertySpecification, this);
    }

    public get body(): string {
        return this._body;
    }

    public async setBody(value: string, atDate: Date, asUser?: User): Promise<void> {
        if (this._lastEditedAt < atDate) {
            this.lastEditedAt = atDate;
            this._body = value;
            this._lastEditedAt = atDate;
            this.markChanged();
            await (await this.issueProperty.getPublic()).participatedAt(asUser, atDate);
        }
    }

    /**
     * Async getter function for the bodyProperty but rendered out to html returning the rendered version of the markdown
     * @returns A promise of the body __html__ of this issue
     */
    public async bodyRendered(): Promise<string> {
        return mdRenderer.render(this.body);
    }

    /**
     * Overwrites the SyncNode propety with the actual data
     */
    public get lastEditedAt(): Date {
        return this._lastEditedAt;
    }

    /**
     * sets lastEditedAt if the provided date is newer
     */
    public set lastEditedAt(value: Date) {
        if (this._lastEditedAt < value) {
            this._lastEditedAt = value;
            this.markChanged();
        }
    }

    /**
     * For all immutable SyncNodes, this is just the creation data
     * all other SyncNodes have to overwrite this to implement correct functionality
     */
    public get lastUpdatedAt(): Date {
        return this.lastEditedAt;
    }
}