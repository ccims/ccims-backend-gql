import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const RenamedTitleEventTableSpecification: NodeTableSpecification<RenamedTitleEvent>
    = new NodeTableSpecification<RenamedTitleEvent>("issue_timeline_renamed_title_event", IssueTimelineItemTableSpecification,
    RowSpecification.fromProperty("old_title", "oldTitle"),
    RowSpecification.fromProperty("new_title", "newTitle"));

export class RenamedTitleEvent extends IssueTimelineItem {

    private _oldTitle: string;

    private _newTitle: string;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldTitle: string, newTitle: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.AddedToComponentEvent, databaseManager, RenamedTitleEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this._oldTitle = oldTitle;
        this._newTitle = newTitle;
    }

    /**
     * WARNING: this does NOT change the title of the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldTitle: string, newTitle: string): Promise<RenamedTitleEvent> {
        const event = new RenamedTitleEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldTitle, newTitle, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get oldTitle(): string {
        return this._newTitle;
    }

    public set oldTitle(value: string) {
        if (this.oldTitle !== value) {
            this._oldTitle = value;
            this.markChanged();
        }
    }

    public get newTitle(): string {
        return this._newTitle;
    }

    public set newTitle(value: string) {
        if (this._newTitle !== value) {
            this._newTitle = value;
            this.markChanged();
        }
    }

}