import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../../database/commands/load/LoadRelationCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeListProperty } from "../properties/NodeListProperty";
import { NodeListPropertySpecification } from "../properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";

/**
* a table specification for a Comment
* does not specifiy the metadata, because this is up to the save method
*/
export const CommentTableSpecification: NodeTableSpecification<Comment>
   = new NodeTableSpecification<Comment>("issue_timelineItem", IssueTimelineItemTableSpecification, 
   RowSpecification.fromProperty("body", "body"),
   RowSpecification.fromProperty("last_edited_at", "lastEditedAt"),
   new RowSpecification("last_edited_by", comment => comment.lastEditedByProperty.getId()));

export class Comment<T extends Comment = any> extends IssueTimelineItem<T> {

    private _body: string;

    public readonly editedByProperty: NodeListProperty<User, Comment>;

    private static readonly editedByPropertySpecification: NodeListPropertySpecification<User, Comment>
        = NodeListPropertySpecification.loadDynamic<User, Comment>(LoadRelationCommand.fromPrimary("comment", "editedBy"),
        (ids, comment) => {
            const command = new LoadUsersCommand();
            command.ids = ids;
            return command;
        },
        comment => {
            //TODO
            const command = new LoadUsersCommand();
            //command.onComponents = [command.id];
            return command;
        })
        //TODO .notifyChanged((user, comment) => project.componentsProperty)
        .saveOnPrimary("comment", "editedBy");

    public readonly lastEditedByProperty: NullableNodeProperty<User, Comment>;

    private static readonly lastEditedByPropertySpecification: NodePropertySpecification<User, Comment>
        = new NodePropertySpecification<User, Comment>(
            (id, comment) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            comment => new GetWithReloadCommand(comment, "last_edited_by", new LoadUsersCommand())
            //TODO notifier?
        );

    private _lastEditedAt: Date;

    //TODO: reactions
    //TODO? currentUserCanEdit

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
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, issueId, isDeleted, metadata);
        this._lastEditedAt = lastEditedAt;
        this._body = body;
        this.editedByProperty = this.registerSaveable(new NodeListProperty<User, Comment>(databaseManager, Comment.editedByPropertySpecification, this));
        this.lastEditedByProperty = this.registerSaveable(new NullableNodeProperty<User, Comment>(databaseManager, Comment.lastEditedByPropertySpecification, this, lastEditedById));
    }

    public get body(): string {
        return this._body;
    }

    public setBody(value: string, atDate: Date, asUser?: User) {
        if (this._lastEditedAt < atDate) {
            this.lastEditedAt = atDate;
            this._body = value;
            this._lastEditedAt
            this.markChanged();
        }
    }

    public get lastEditedAt(): Date {
        return this._lastEditedAt;
    }

    public set lastEditedAt(value: Date) {
        this._lastEditedAt = value;
        this.markChanged();
    }
}