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

export const LinkEventTableSpecification: NodeTableSpecification<LinkEvent>
    = new NodeTableSpecification<LinkEvent>("link_event", IssueTimelineItemTableSpecification,
    new RowSpecification("linked_issue", linkEvent => linkEvent.linkedIssueProperty.getId()));

export class LinkEvent extends IssueTimelineItem {

    public readonly linkedIssueProperty: NullableNodeProperty<Issue, LinkEvent>;

    private static readonly linkedIssuePropertySpecification: NodePropertySpecification<Issue, LinkEvent>
        = new NodePropertySpecification<Issue, LinkEvent>(
            (id, linkEvent) => {
                const command = new LoadIssuesCommand(true);
                command.ids = [id];
                return command;
            },
            linkEvent => new GetWithReloadCommand(linkEvent, "linked_issue", new LoadIssuesCommand(true)),
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, linkedIssueId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.LinkEvent, databaseManager, LinkEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.linkedIssueProperty = new NullableNodeProperty<Issue, LinkEvent>(databaseManager, LinkEvent.linkedIssuePropertySpecification, this, linkedIssueId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, linkedIssue: Issue): Promise<LinkEvent> {
        const event = new LinkEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, linkedIssue.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async linkedIssue(): Promise<Issue | undefined> {
        return this.linkedIssueProperty.getPublic();
    }

}