import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadIssueTimelineItemsCommand } from "../database/commands/load/nodes/timeline/LoadIssueTimelineItemsCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { LoadBodiesCommand } from "../database/commands/load/nodes/timeline/LoadBodiesCommand";
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
import { IssueLocation } from "./IssueLocation";
import { LoadIssueLocationsCommand } from "../database/commands/load/nodes/LoadIssueLocationsCommand";
import { Component } from "./Component";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";


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
                const command = new LoadBodiesCommand();
                command.ids = [id];
                return command;
            },
            timelineItem => new GetWithReloadCommand(timelineItem, "body_id", new LoadBodiesCommand())
            // no notifier because this is never allowed to change
        );

    /**
     * Async getter function for the bodyProperty returning only the body __text__
     * @returns A promise of the body __text__ of this issue
     */
    public async body(): Promise<string> {
        return (await this.bodyProperty.get()).body
    }


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

    public readonly participantsProperty: NodeListProperty<User, Issue>;

    private static readonly participantsPropertySpecification: NodeListPropertySpecification<User, Issue>
        = NodeListPropertySpecification.loadDynamic<User, Issue>(LoadRelationCommand.fromPrimary("issue", "participant"),
            (ids, issue) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadUsersCommand();
                command.participantOfIssue = [issue.id];
                return command;
            })
            .notifyChanged((user, issue) => user.participantOfIssuesProperty)
            .saveOnPrimary("issue", "participant");

    /**
     * do not use this to add / remove assignees directly!
     */
    public readonly assigneesProperty: NodeListProperty<User, Issue>;

    private static readonly assigneesPropertySpecification: NodeListPropertySpecification<User, Issue>
        = NodeListPropertySpecification.loadDynamic<User, Issue>(LoadRelationCommand.fromPrimary("issue", "assignee"),
            (ids, issue) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadUsersCommand();
                command.assignedToIssues = [issue.id];
                return command;
            })
            .notifyChanged((user, issue) => user.assignedToIssuesProperty)
            .saveOnPrimary("issue", "assignee");

    public readonly locationsProperty: NodeListProperty<IssueLocation, Issue>;

    private static readonly locationsPropertySpecification: NodeListPropertySpecification<IssueLocation, Issue>
        = NodeListPropertySpecification.loadDynamic<IssueLocation, Issue>(LoadRelationCommand.fromSecundary("issueLocation", "issue"),
            (ids, issue) => {
                const command = new LoadIssueLocationsCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssueLocationsCommand();
                command.hasIssueOnLocation = [issue.id];
                return command;
            })
            .notifyChanged((issueLocation, issue) => issueLocation.issuesOnLocationProperty)
            .noSave();

    public readonly componentsProperty: NodeListProperty<Component, Issue>;

    private static readonly componentsPropertySpecification: NodeListPropertySpecification<Component, Issue>
        = NodeListPropertySpecification.loadDynamic<Component, Issue>(LoadRelationCommand.fromSecundary("component", "issue"),
            (ids, issue) => {
                const command = new LoadComponentsCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadComponentsCommand();
                command.hasIssue = [issue.id];
                return command;
            })
            .notifyChanged((issueLocation, issue) => issueLocation.issuesOnLocationProperty)
            .noSave();

    /**
     * Property of all components this issue is currently pinned on
     * do NOT pin an issue via this property
     */
    public readonly pinnedOnProperty: NodeListProperty<Component, Issue>;

    /**
     * Static specification for the property of all components this issue is pinned on
     */
    private static readonly pinnedOnPropertySpecification: NodeListPropertySpecification<Component, Issue>
        = NodeListPropertySpecification.loadDynamic<Component, Issue>(LoadRelationCommand.fromSecundary("component", "pinnedIssue"),
            (ids, issue) => {
                const command = new LoadComponentsCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadComponentsCommand();
                command.hasIssue = [issue.id];
                return command;
            })
            .notifyChanged((component, issue) => component.pinnedIssuesProperty)
            .noSave();

    /**
     * Property conaining all issues that are linked to by this issue (where this issue is the origin of the __relation__)
     * do NOT add a linked issue via this property
     */
    public readonly linksToIssuesProperty: NodeListProperty<Issue, Issue>;

    /**
     * Specification for the linkedTo property
     */
    private static readonly linksToIssuesPropertySpecification: NodeListPropertySpecification<Issue, Issue>
        = NodeListPropertySpecification.loadDynamic<Issue, Issue>(LoadRelationCommand.fromPrimary("issue", "linkedIssues"),
            (ids, issue) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssuesCommand();
                command.linkedByIssues = [issue.id];
                return command;
            })
            .notifyChanged((linksToIssue, issue) => linksToIssue.linkedByIssuesProperty)
            .saveOnPrimary("issue", "linkedIssues");

    /**
     * Property conaining all issues that are linked to by this issue (where this issue is the __destination__)
     * do NOT add a linked issue via this property
     */
    public readonly linkedByIssuesProperty: NodeListProperty<Issue, Issue>;

    /**
     * Specification for the linkedTo property
     */
    private static readonly linkedByIssuesPropertySpecification: NodeListPropertySpecification<Issue, Issue>
        = NodeListPropertySpecification.loadDynamic<Issue, Issue>(LoadRelationCommand.fromPrimary("issue", "linkedIssues"),
            (ids, issue) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssuesCommand();
                command.linkedByIssues = [issue.id];
                return command;
            })
            .notifyChanged((linkedByIssue, issue) => linkedByIssue.linksToIssuesProperty)
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
        this.bodyProperty = new NodeProperty<Body, Issue>(databaseManager, Issue.bodyPropertySpecification, this, bodyId);
        this.timelineProperty = new NodeListProperty<IssueTimelineItem, Issue>(databaseManager, Issue.timelinePropertySpecification, this);
        this.participantsProperty = new NodeListProperty<User, Issue>(databaseManager, Issue.participantsPropertySpecification, this);
        this.assigneesProperty = new NodeListProperty<User, Issue>(databaseManager, Issue.assigneesPropertySpecification, this);
        this.locationsProperty = new NodeListProperty<IssueLocation, Issue>(databaseManager, Issue.locationsPropertySpecification, this);
        this.componentsProperty = new NodeListProperty<Component, Issue>(databaseManager, Issue.componentsPropertySpecification, this);
        this.pinnedOnProperty = new NodeListProperty<Component, Issue>(databaseManager, Issue.pinnedOnPropertySpecification, this);
        this.linksToIssuesProperty = new NodeListProperty<Issue, Issue>(databaseManager, Issue.linksToIssuesPropertySpecification, this);
        this.linkedByIssuesProperty = new NodeListProperty<Issue, Issue>(databaseManager, Issue.linkedByIssuesPropertySpecification, this);
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, title: string, body: string): Promise<Issue> {
        const issueId = databaseManager.idGenerator.generateString();
        const bodyId = databaseManager.idGenerator.generateString();

        const issue = new Issue(databaseManager, issueId, createdBy?.id, createdAt, title, true, false, IssueCategory.Unclassified, undefined, undefined,
            undefined, undefined, createdAt, bodyId, false);
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

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * sets updateAt if the provided date is newer
     */
    public set updatedAt(value: Date) {
        if (this._updatedAt < value) {
            this._updatedAt = value;
            this.markChanged();
        }
    }

    public async participatedAt(participant?: User, atDate?: Date): Promise<void> {
        if (atDate) {
            this.updatedAt = atDate;
        }
        if (participant) {
            await this.participantsProperty.add(participant);
        }
    }

}

export enum IssueCategory {
    Bug = "BUG",
    FeatureRequest = "FEATURE_REQUEST",
    Unclassified = "UNCLASSIFIED"
}

export enum IssuePriority {
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH"
}