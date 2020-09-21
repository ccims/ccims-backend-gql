import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { DeletedNodes } from "../DeletedNodes";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const DeletedIssueCommentTableSpecification: NodeTableSpecification<DeletedIssueComment>
    = new NodeTableSpecification<DeletedIssueComment>("issue_timeline_deletedIssueComment", IssueTimelineItemTableSpecification);

export class DeletedIssueComment extends IssueTimelineItem {

    private _deletedAt: Date;

    public readonly deletedByProperty: NodeProperty<User, DeletedIssueComment>;

    private static readonly deletedByPropertySpecification: NodePropertySpecification<User, DeletedIssueComment>
        = new NodePropertySpecification<User, DeletedIssueComment>(
            (id, deletedByProperty) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            deletedByProperty => new GetWithReloadCommand(deletedByProperty, "deleted_by", new LoadUsersCommand()),
            DeletedNodes.User
        );


    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, deletedById: string, deletedAt: Date,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.DeletedIssueComment, databaseManager, DeletedIssueCommentTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this._deletedAt = deletedAt;
        this.deletedByProperty = new NodeProperty<User, DeletedIssueComment>(databaseManager, DeletedIssueComment.deletedByPropertySpecification, this, deletedById);
    }

    /**
     * WARNING: this does not delete the old comment!
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, deletedBy: User, deletedAt: Date): Promise<DeletedIssueComment> {
        const event = new DeletedIssueComment(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, deletedBy.id, deletedAt, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get deletedAt(): Date {
        return this._deletedAt;
    }

    public set deletedAt(value: Date) {
        if (this.deletedAt !== value) {
            this._deletedAt = value;
            this.markChanged();
        }
    }
}