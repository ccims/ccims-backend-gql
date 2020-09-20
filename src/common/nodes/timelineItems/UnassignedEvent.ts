import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const UnassignedEventTableSpecification: NodeTableSpecification<UnassignedEvent>
    = new NodeTableSpecification<UnassignedEvent>("issue_timeline_unassignedEvent", IssueTimelineItemTableSpecification,
    new RowSpecification("removedAssignee", unassignedEvent => unassignedEvent.removedassigneeProperty.getId()));

export class UnassignedEvent extends IssueTimelineItem {

    public readonly removedassigneeProperty: NodeProperty<User, UnassignedEvent>;

    private static readonly removedassigneePropertySpecification: NodePropertySpecification<User, UnassignedEvent>
        = new NodePropertySpecification<User, UnassignedEvent>(
            (id, unassignedEvent) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            unassignedEvent => new GetWithReloadCommand(unassignedEvent, "removedAssignee", new LoadUsersCommand()),
            User.deletedId
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, removedassigneeId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.UnassignedEvent, databaseManager, UnassignedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.removedassigneeProperty = new NodeProperty<User, UnassignedEvent>(databaseManager, UnassignedEvent.removedassigneePropertySpecification, this, removedassigneeId);
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
        const event = new UnassignedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, removedassignee.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedassignee(): Promise<User> {
        return this.removedassigneeProperty.get();
    }
}