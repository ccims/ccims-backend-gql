import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";
import { LoadLabelsCommand } from "../../database/commands/load/nodes/LoadLabelsCommand";
import { Label } from "../Label";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";

export const UnlabelledEventTableSpecification: NodeTableSpecification<UnlabelledEvent>
    = new NodeTableSpecification<UnlabelledEvent>("issue_timeline_unlabelled_event", IssueTimelineItemTableSpecification,
        new RowSpecification("label", labelledEvent => labelledEvent.labelProperty.getId()));

export class UnlabelledEvent extends IssueTimelineItem {

    public readonly labelProperty: NullableNodeProperty<Label, UnlabelledEvent>;

    private static readonly labelPropertySpecification: NodePropertySpecification<Label, UnlabelledEvent>
        = new NodePropertySpecification<Label, UnlabelledEvent>(
            (id, labelledEvent) => {
                const command = new LoadLabelsCommand(true);
                command.ids = [id];
                return command;
            },
            labelledEvent => new GetWithReloadCommand(labelledEvent, "label", new LoadLabelsCommand(true)),
        );

    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, labelId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.AssignedEvent, databaseManager, UnlabelledEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.labelProperty = new NullableNodeProperty<Label, UnlabelledEvent>(databaseManager, UnlabelledEvent.labelPropertySpecification, this, labelId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, label: Label): Promise<UnlabelledEvent> {
        const event = new UnlabelledEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, label.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedLabel(): Promise<Label | undefined> {
        return this.labelProperty.getPublic();
    }
}