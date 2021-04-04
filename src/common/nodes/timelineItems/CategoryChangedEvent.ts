import { DatabaseManager } from "../../database/DatabaseManager";
import { IssueCategory } from "../enums/IssueCategory";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const CategoryChangedEventTableSpecification: NodeTableSpecification<CategoryChangedEvent>
    = new NodeTableSpecification<CategoryChangedEvent>("issue_timeline_category_changed_event", IssueTimelineItemTableSpecification,
    RowSpecification.fromProperty("old_category", "oldCategory"),
    RowSpecification.fromProperty("new_category", "newCategory"));

export class CategoryChangedEvent extends IssueTimelineItem {

    private _oldCategory: IssueCategory;

    private _newCategory: IssueCategory;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldCategory: IssueCategory, newCategory: IssueCategory,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.CategoryChangedEvent, databaseManager, CategoryChangedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this._oldCategory = oldCategory;
        this._newCategory = newCategory;
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldCategory: IssueCategory, newCategory: IssueCategory): Promise<CategoryChangedEvent> {
        const event = new CategoryChangedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldCategory, newCategory, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public get oldCategory(): IssueCategory {
        return this._oldCategory;
    }

    public set oldCategory(value: IssueCategory) {
        if (this._oldCategory !== value) {
            this._oldCategory = value;
            this.markChanged();
        }
    }

    public get newCategory(): IssueCategory {
        return this._newCategory;
    }

    public set newCategory(value: IssueCategory) {
        if (this._newCategory !== value) {
            this._newCategory = value;
            this.markChanged();
        }
    }
}