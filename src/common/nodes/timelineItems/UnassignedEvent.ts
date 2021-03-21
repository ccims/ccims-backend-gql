import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
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

export const UnassignedEventTableSpecification: NodeTableSpecification<UnassignedEvent>
    = new NodeTableSpecification<UnassignedEvent>("issue_timeline_unassigned_event", IssueTimelineItemTableSpecification,
    new RowSpecification("removed_assignee", unassignedEvent => unassignedEvent.removedassigneeProperty.getId()));

export class UnassignedEvent extends IssueTimelineItem {

    public readonly removedassigneeProperty: NullableNodeProperty<User, UnassignedEvent>;

    private static readonly removedassigneePropertySpecification: NodePropertySpecification<User, UnassignedEvent>
        = new NodePropertySpecification<User, UnassignedEvent>(
            (id, unassignedEvent) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            unassignedEvent => new GetWithReloadCommand(unassignedEvent, "removedAssignee", new LoadUsersCommand()),
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, removedassigneeId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.UnassignedEvent, databaseManager, UnassignedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.removedassigneeProperty = new NullableNodeProperty<User, UnassignedEvent>(databaseManager, UnassignedEvent.removedassigneePropertySpecification, this, removedassigneeId);
    }

    /**
     * WARNING: this does NOT remove the user as assignee from the issue
     * this does NOT check if the user is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, removedassignee: User): Promise<UnassignedEvent> {
        const event = new UnassignedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, removedassignee.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedassignee(): Promise<User | undefined> {
        return this.removedassigneeProperty.getPublic();
    }
}