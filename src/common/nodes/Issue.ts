import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadIssueTimelineItemsCommand } from "../database/commands/load/nodes/LoadIssueTimelineItemsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { SyncMetadataMap, SyncNode, SyncNodeTableSpecification } from "./SyncNode";
import { Body } from "./timelineItems/Body";
import { IssueTimelineItem } from "./timelineItems/IssueTimelineItem";
import { User } from "./User";


/**
* a table specification for a Comment
* does not specifiy the metadata, because this is up to the save method
*/
export const IssueTableSpecification: NodeTableSpecification<Issue>
   = new NodeTableSpecification<Issue>("issue_issue", SyncNodeTableSpecification, 
   RowSpecification.fromProperty("title", "title"),
   RowSpecification.fromProperty("is_open", "isOpen"),
   RowSpecification.fromProperty("is_duplicate", "isDuplicate"),
   RowSpecification.fromProperty("category", "category"),
   RowSpecification.fromProperty("start_date", "startDate"),
   RowSpecification.fromProperty("due_date", "dueDate"),
   RowSpecification.fromProperty("estimated_time", "estimatedTime"),
   RowSpecification.fromProperty("spent_time", "spentTime"),
   new RowSpecification("body_id", issue => issue.bodyProperty.getId()));


/**
 * An issue
 */
export class Issue extends SyncNode<Issue> {
    private _title: string;

    private _isOpen: boolean;

    private _isDuplicate: boolean;

    private _category: IssueCategory;

    private _startDate?: Date;

    private _dueDate?: Date;

    private _estimatedTime?: number;

    private _spentTime?: number;

    private _updatedAt: Date;

    public readonly bodyProperty: NodeProperty<Body, Issue>;

    private static readonly bodyPropertySpecification: NodePropertySpecification<Body, Issue>
        = new NodePropertySpecification<Body, Issue>(
            (id, timelineItem) => {
                //TODO
                const command = undefined as any;
                command.ids = [id];
                return command;
            },
            //TODO
            timelineItem => new GetWithReloadCommand(timelineItem, "body_id", undefined as any)
        );
    
    public readonly timelineProperty: NodeListProperty<IssueTimelineItem, Issue>;

    private static readonly timelinePropertySpecification: NodeListPropertySpecification<IssueTimelineItem, Issue>
        = NodeListPropertySpecification.loadDynamic<IssueTimelineItem, Issue>(LoadRelationCommand.fromManySide("issue_timelineItem", "issue"),
        (ids, issue) => {
            const command = new LoadIssueTimelineItemsCommand();
            command.ids = ids;
            return command;
        },
        issue => {
            const command = new LoadIssueTimelineItemsCommand();
            command.onIssues = [issue.id];
            return command;
        })
        .notifyChanged((timelineItem, issue) => timelineItem.issueProperty)
        .noSave();

    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, title: string, isOpen: boolean, isDuplicate: boolean, category: IssueCategory,
        startDate: Date | undefined, dueDate: Date | undefined, estimatedTime: number | undefined, spentTime: number | undefined, updateAt: Date, bodyId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.Issue, databaseManager, IssueTableSpecification, id, createdById, createdAt, isDeleted, metadata);

        this._title = title;
        this._isOpen = isOpen;
        this._isDuplicate = isDuplicate;
        this._category = category;
        this._startDate = startDate;
        this._dueDate = dueDate;
        this._estimatedTime = estimatedTime;
        this._spentTime = spentTime;
        this._updatedAt = updateAt;
        this.bodyProperty = this.registerSaveable(new NodeProperty<Body, Issue>(databaseManager, Issue.bodyPropertySpecification, this, bodyId));
        this.timelineProperty = this.registerSaveable(new NodeListProperty<IssueTimelineItem, Issue>(databaseManager, Issue.timelinePropertySpecification, this));
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, title: string, body: string, isOpen: boolean, isDuplicate: boolean,
        category: IssueCategory, startDate?: Date, dueDate?: Date, estimatedTime?: number, spentTime?: number): Promise<Issue> {
        const issueId = databaseManager.idGenerator.generateString();
        const bodyId = databaseManager.idGenerator.generateString();

        const issue = new Issue(databaseManager, issueId, createdBy?.id, createdAt, title, isOpen, isDuplicate, category, startDate, dueDate,
            estimatedTime, spentTime, createdAt, bodyId, false);
        issue.markNew();
        databaseManager.addCachedNode(issue);

        const timelineBody = new Body(databaseManager, bodyId, createdBy?.id, createdAt, issueId, body, createdBy?.id, createdAt, title, false);
        timelineBody.markNew();
        databaseManager.addCachedNode(timelineBody);

        if (createdBy) {
            await timelineBody.editedByProperty.add(createdBy);
        }

        return issue;
    }


    public get title(): string {
        return this._title;
    }

    public get isOpen(): boolean {
        return this._isOpen;
    }

    public get isDuplicate(): boolean {
        return this._isDuplicate;
    }

    public get category(): IssueCategory {
        return this._category;
    }

    public get startDate(): Date | undefined {
        return this._startDate;
    }

    public get dueDate(): Date | undefined {
        return this._dueDate;
    }

    public get estimatedTime(): number | undefined {
        return this._estimatedTime;
    }

    public get spentTime(): number | undefined {
        return this._spentTime;
    }

    public get updateAt(): Date {
        return this._updatedAt;
    }
        
}

export enum IssueCategory {
    Bug = "Bug", 
    FeatureRequest = "FeatureRequst",
    Unclassified = "Unclassified"
}