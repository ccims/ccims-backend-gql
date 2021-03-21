import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const DueDateChangedEventTableSpecification: NodeTableSpecification<DueDateChangedEvent>
    = new NodeTableSpecification<DueDateChangedEvent>("issue_timeline_due_date_changed_event", IssueTimelineItemTableSpecification,
    RowSpecification.fromProperty("old_due_date", "oldDueDate"),
    RowSpecification.fromProperty("new_due_date", "newDueDate"));

export class DueDateChangedEvent extends IssueTimelineItem {

    private _oldDueDate?: Date;

    private _newDueDate?: Date;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldDueDate: Date | undefined, newDueDate: Date | undefined,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.DueDateChangedEvent, databaseManager, DueDateChangedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this._oldDueDate = oldDueDate;
        this._newDueDate = newDueDate;
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldDueDate?: Date, newDueDate?: Date): Promise<DueDateChangedEvent> {
        const event = new DueDateChangedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldDueDate, newDueDate, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get oldDueDate(): Date | undefined {
        return this._oldDueDate;
    }

    public set oldDueDate(value: Date | undefined) {
        if (this._oldDueDate !== value) {
            this._oldDueDate = value;
            this.markChanged();
        }
    }

    public get newDueDate(): Date | undefined {
        return this._newDueDate;
    }

    public set newDueDate(value: Date | undefined) {
        if (this._newDueDate !== value) {
            this._newDueDate = value;
            this.markChanged();
        }
    }
}