import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const StartDateChangedEventTableSpecification: NodeTableSpecification<StartDateChangedEvent>
    = new NodeTableSpecification<StartDateChangedEvent>("issue_timeline_start_date_changed_event", IssueTimelineItemTableSpecification,
    RowSpecification.fromProperty("old_start_date", "oldStartDate"),
    RowSpecification.fromProperty("new_start_date", "newStartDate"));

export class StartDateChangedEvent extends IssueTimelineItem {

    private _oldStartDate?: Date;

    private _newStartDate?: Date;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldStartDate: Date | undefined, newStartDate: Date | undefined,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.StartDateChangedEvent, databaseManager, StartDateChangedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this._oldStartDate = oldStartDate;
        this._newStartDate = newStartDate;
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldStartDate?: Date, newStartDate?: Date): Promise<StartDateChangedEvent> {
        const event = new StartDateChangedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldStartDate, newStartDate, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get oldStartDate(): Date | undefined {
        return this._oldStartDate;
    }

    public set oldStartDate(value: Date | undefined) {
        if (this._oldStartDate !== value) {
            this._oldStartDate = value;
            this.markChanged();
        }
    }

    public get newStartDate(): Date | undefined {
        return this._newStartDate;
    }

    public set newStartDate(value: Date | undefined) {
        if (this._newStartDate !== value) {
            this._newStartDate = value;
            this.markChanged();
        }
    }
}