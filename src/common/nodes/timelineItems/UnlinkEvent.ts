import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const UnlinkEventTableSpecification: NodeTableSpecification<UnlinkEvent>
    = new NodeTableSpecification<UnlinkEvent>("unlink_event", IssueTimelineItemTableSpecification,
    new RowSpecification("linked_issue_to_remove_id", linkEvent => linkEvent.unlinkedIssueProperty.getId()));

export class UnlinkEvent extends IssueTimelineItem {

    public readonly unlinkedIssueProperty: NullableNodeProperty<Issue, UnlinkEvent>;

    private static readonly unlinkedIssuePropertySpecification: NodePropertySpecification<Issue, UnlinkEvent>
        = new NodePropertySpecification<Issue, UnlinkEvent>(
            (id, unlinkEvent) => {
                const command = new LoadIssuesCommand(true);
                command.ids = [id];
                return command;
            },
            unlinkEvent => new GetWithReloadCommand(unlinkEvent, "linked_issue_to_remove_id", new LoadIssuesCommand(true)),
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, linkedIssueId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.UnlinkEvent, databaseManager, UnlinkEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.unlinkedIssueProperty = new NullableNodeProperty<Issue, UnlinkEvent>(databaseManager, UnlinkEvent.unlinkedIssuePropertySpecification, this, linkedIssueId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, unlinkedIssue: Issue): Promise<UnlinkEvent> {
        const event = new UnlinkEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, unlinkedIssue.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedLinkedIssue(): Promise<Issue | undefined> {
        return this.unlinkedIssueProperty.getPublic();
    }

}