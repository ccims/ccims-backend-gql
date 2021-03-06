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

export const WasUnlinkedEventTableSpecification: NodeTableSpecification<WasUnlinkedEvent>
    = new NodeTableSpecification<WasUnlinkedEvent>("issue_timeline_was_unlinked_event", IssueTimelineItemTableSpecification,
    new RowSpecification("unlinked_by", wasLinkedEvent => wasLinkedEvent.unlinkedByIssueProperty.getId()));

export class WasUnlinkedEvent extends IssueTimelineItem {

    public readonly unlinkedByIssueProperty: NodeProperty<Issue, WasUnlinkedEvent>;

    private static readonly unlinkedByIssuePropertySpecification: NodePropertySpecification<Issue, WasUnlinkedEvent>
        = new NodePropertySpecification<Issue, WasUnlinkedEvent>(
            (id, wasUnlinkedEvent) => {
                const command = new LoadIssuesCommand();
                command.ids = [id];
                return command;
            },
            wasUnlinkedEvent => new GetWithReloadCommand(wasUnlinkedEvent, "unlinked_by", new LoadIssuesCommand()),
            DeletedNodes.Issue
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, linkedIssueId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.WasUnlinkedEvent, databaseManager, WasUnlinkedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.unlinkedByIssueProperty = new NodeProperty<Issue, WasUnlinkedEvent>(databaseManager, WasUnlinkedEvent.unlinkedByIssuePropertySpecification, this, linkedIssueId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, unlinkedByIssue: Issue): Promise<WasUnlinkedEvent> {
        const event = new WasUnlinkedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, unlinkedByIssue.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async unlinkedBy(): Promise<Issue> {
        return this.unlinkedByIssueProperty.get();
    }

}