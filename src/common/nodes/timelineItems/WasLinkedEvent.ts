import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const WasLinkedEventTableSpecification: NodeTableSpecification<WasLinkedEvent>
    = new NodeTableSpecification<WasLinkedEvent>("was_linked_event", IssueTimelineItemTableSpecification,
    new RowSpecification("linked_by", wasLinkedEvent => wasLinkedEvent.linkedByIssueProperty.getId()));

export class WasLinkedEvent extends IssueTimelineItem {

    public readonly linkedByIssueProperty: NullableNodeProperty<Issue, WasLinkedEvent>;

    private static readonly linkedByIssuePropertySpecification: NodePropertySpecification<Issue, WasLinkedEvent>
        = new NodePropertySpecification<Issue, WasLinkedEvent>(
            (id, wasLinkedEvent) => {
                const command = new LoadIssuesCommand(true);
                command.ids = [id];
                return command;
            },
            wasLinkedEvent => new GetWithReloadCommand(wasLinkedEvent, "linked_by", new LoadIssuesCommand(true)),
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, linkedIssueId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.WasLinkedEvent, databaseManager, WasLinkedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.linkedByIssueProperty = new NullableNodeProperty<Issue, WasLinkedEvent>(databaseManager, WasLinkedEvent.linkedByIssuePropertySpecification, this, linkedIssueId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, linkedByIssue: Issue): Promise<WasLinkedEvent> {
        const event = new WasLinkedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, linkedByIssue.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async linkedBy(): Promise<Issue | undefined> {
        return this.linkedByIssueProperty.getPublic();
    }

}