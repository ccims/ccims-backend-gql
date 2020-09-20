import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { DeletedNodes } from "../DeletedNodes";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const LinkEventTableSpecification: NodeTableSpecification<LinkEvent>
    = new NodeTableSpecification<LinkEvent>("issue_timeline_linkEvent", IssueTimelineItemTableSpecification,
    new RowSpecification("linked_issue", linkEvent => linkEvent.linkedIssueProperty.getId()));

export class LinkEvent extends IssueTimelineItem {

    public readonly linkedIssueProperty: NodeProperty<Issue, LinkEvent>;

    private static readonly linkedIssuePropertySpecification: NodePropertySpecification<Issue, LinkEvent>
        = new NodePropertySpecification<Issue, LinkEvent>(
            (id, linkEvent) => {
                const command = new LoadIssuesCommand();
                command.ids = [id];
                return command;
            },
            linkEvent => new GetWithReloadCommand(linkEvent, "linked_issue", new LoadIssuesCommand()),
            DeletedNodes.Issue
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, linkedIssueId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.LinkEvent, databaseManager, LinkEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.linkedIssueProperty = new NodeProperty<Issue, LinkEvent>(databaseManager, LinkEvent.linkedIssuePropertySpecification, this, linkedIssueId);
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
        const event = new LinkEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, linkedIssue.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }


}