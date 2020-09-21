import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue, IssueCategory } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const CategoryChangedEventTableSpecification: NodeTableSpecification<CategoryChangedEvent>
    = new NodeTableSpecification("issue_timeline_categoryChangedEvent", IssueTimelineItemTableSpecification,
    )

export class CategoryChangedEvent extends IssueTimelineItem {

    private _oldCategory: IssueCategory;

    private _newCategory: IssueCategory;

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, oldCategory: IssueCategory, newCategory: IssueCategory,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.CategoryChangedEvent, databaseManager, CategoryChangedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this._oldCategory = oldCategory;
        this._newCategory = newCategory;
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, oldCategory: IssueCategory, newCategory: IssueCategory): Promise<CategoryChangedEvent> {
        const event = new CategoryChangedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, oldCategory, newCategory, false);
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