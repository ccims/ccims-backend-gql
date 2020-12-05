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
import { LoadLabelsCommand } from "../../database/commands/load/nodes/LoadLabelsCommand";
import { Label } from "../Label";

export const LabelledEventTableSpecification: NodeTableSpecification<LabelledEvent>
    = new NodeTableSpecification<LabelledEvent>("issue_timeline_labelled_event", IssueTimelineItemTableSpecification,
        new RowSpecification("label", labelledEvent => labelledEvent.labelProperty.getId()));

export class LabelledEvent extends IssueTimelineItem {

    public readonly labelProperty: NodeProperty<Label, LabelledEvent>;

    private static readonly labelPropertySpecification: NodePropertySpecification<Label, LabelledEvent>
        = new NodePropertySpecification<Label, LabelledEvent>(
            (id, labelledEvent) => {
                const command = new LoadLabelsCommand();
                command.ids = [id];
                return command;
            },
            labelledEvent => new GetWithReloadCommand(labelledEvent, "label", new LoadLabelsCommand()),
            DeletedNodes.Label
        );

    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, labelId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.AssignedEvent, databaseManager, LabelledEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.labelProperty = new NodeProperty<Label, LabelledEvent>(databaseManager, LabelledEvent.labelPropertySpecification, this, labelId);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, label: Label): Promise<LabelledEvent> {
        const event = new LabelledEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, label.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async label(): Promise<Label> {
        return this.labelProperty.get();
    }
}