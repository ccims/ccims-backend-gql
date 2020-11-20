import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { Comment, CommentTableSpecification } from "./Comment";

/**
 * a table specification for an IssueComment
 * does not specifiy the metadata, because this is up to the save method
 */
export const IssueCommentTableSpecification: NodeTableSpecification<IssueComment>
   = new NodeTableSpecification<IssueComment>("issue_timeline_comment", CommentTableSpecification);

export class IssueComment extends Comment<IssueComment> {

    /**
     * abstract constructor for extending classes
     * this has no static constructor because it is created with the static constructor of Issue
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, body: string, lastEditedById: string | undefined, lastEditedAt: Date,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.IssueComment, databaseManager, IssueCommentTableSpecification, id, createdById, createdAt, issueId, body, lastEditedById, lastEditedAt, isDeleted, metadata);
    }

    /**
     * WARNING: this does NOT add the issue to the specified component, but does only create the event
     * this does NOT check if the component is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, body: string): Promise<IssueComment> {
        const comment = new IssueComment(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, body, createdBy?.id, createdAt, false);
        comment.markNew();
        databaseManager.addCachedNode(comment);
        await issue.timelineProperty.add(comment);
        if (createdBy) {
            await comment.editedByProperty.add(createdBy);
        }
        return comment;
    }

}