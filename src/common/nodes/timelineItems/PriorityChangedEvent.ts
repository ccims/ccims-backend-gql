import { DatabaseManager } from "../../database/DatabaseManager";
import { IssuePriority } from "../enums/IssuePriority";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const PriorityChangedEventTableSpecification: NodeTableSpecification<PriorityChangedEvent>
    = new NodeTableSpecification<PriorityChangedEvent>("issue_timeline_priority_changed_event", IssueTimelineItemTableSpecification,
    RowSpecification.fromProperty("old_priority", "oldPriority"),
    RowSpecification.fromProperty("new_priority", "newPriority"));

export class PriorityChangedEvent extends IssueTimelineItem {

    private _oldPriority: IssuePriority;

    private _newPriority: IssuePriority;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldPriority: IssuePriority, newPriority: IssuePriority,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.PriorityChangedEvent, databaseManager, PriorityChangedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this._oldPriority = oldPriority;
        this._newPriority = newPriority;
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldPriority: IssuePriority, newPriority: IssuePriority): Promise<PriorityChangedEvent> {
        const event = new PriorityChangedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldPriority, newPriority, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get oldPriority(): IssuePriority {
        return this._oldPriority;
    }

    public set oldPriority(value: IssuePriority) {
        if (this._oldPriority !== value) {
            this._oldPriority = value;
            this.markChanged();
        }
    }

    public get newPriority(): IssuePriority {
        return this._newPriority;
    }

    public set newPriority(value: IssuePriority) {
        if (this._newPriority !== value) {
            this._newPriority = value;
            this.markChanged();
        }
    }
}