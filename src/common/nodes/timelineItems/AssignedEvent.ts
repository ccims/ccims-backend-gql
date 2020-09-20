import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommand";
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

export const AssignedEventTableSpecification: NodeTableSpecification<AssignedEvent>
    = new NodeTableSpecification<AssignedEvent>("issue_timeline_assignedEvent", IssueTimelineItemTableSpecification,
    new RowSpecification("assignee", assignedEvent => assignedEvent.assigneeProperty.getId()));

export class AssignedEvent extends IssueTimelineItem {

    public readonly assigneeProperty: NodeProperty<User, AssignedEvent>;

    private static readonly assigneePropertySpecification: NodePropertySpecification<User, AssignedEvent>
        = new NodePropertySpecification<User, AssignedEvent>(
            (id, assignedEvent) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            assignedEvent => new GetWithReloadCommand(assignedEvent, "assignee", new LoadUsersCommand()),
            DeletedNodes.User
        );

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, assigneeId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.AssignedEvent, databaseManager, AssignedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.assigneeProperty = new NodeProperty<User, AssignedEvent>(databaseManager, AssignedEvent.assigneePropertySpecification, this, assigneeId);
    }

    /**
     * WARNING: this does NOT add the user as assignee to the issue
     * this does NOT check if the user is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, assignee: User): Promise<AssignedEvent> {
        const event = new AssignedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, assignee.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async assignee(): Promise<User> {
        return this.assigneeProperty.get();
    }
}