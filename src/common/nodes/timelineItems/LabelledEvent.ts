import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../../database/commands/load/nodes/LoadUsersCommandBase";
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

export const LabelledEventTableSpecification: NodeTableSpecification<LabelledEvent>
    = new NodeTableSpecification<LabelledEvent>("issue_timeline_labelled_event", IssueTimelineItemTableSpecification,
        new RowSpecification("label", labelledEvent => labelledEvent.labelProperty.getId()));

export class LabelledEvent extends IssueTimelineItem {

    public readonly labelProperty: NullableNodeProperty<Label, LabelledEvent>;

    private static readonly labelPropertySpecification: NodePropertySpecification<Label, LabelledEvent>
        = new NodePropertySpecification<Label, LabelledEvent>(
            (id, labelledEvent) => {
                const command = new LoadLabelsCommand();
                command.ids = [id];
                return command;
            },
            labelledEvent => new GetWithReloadCommand(labelledEvent, "label", new LoadLabelsCommand()),
        );

    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, labelId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.AssignedEvent, databaseManager, LabelledEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.labelProperty = new NullableNodeProperty<Label, LabelledEvent>(databaseManager, LabelledEvent.labelPropertySpecification, this, labelId);
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
        const event = new LabelledEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, label.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async label(): Promise<Label | undefined> {
        return this.labelProperty.getPublic();
    }
}