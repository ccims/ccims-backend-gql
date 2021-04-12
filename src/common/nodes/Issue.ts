import { log } from "../../log";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentInterfacesCommand } from "../database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssueLocationsCommand } from "../database/commands/load/nodes/LoadIssueLocationsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadLabelsCommand } from "../database/commands/load/nodes/LoadLabelsCommand";
import { LoadBodiesCommand } from "../database/commands/load/nodes/timeline/LoadBodiesCommand";
import { LoadIssueTimelineItemsCommand } from "../database/commands/load/nodes/timeline/LoadIssueTimelineItemsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { ComponentInterface } from "./ComponentInterface";
import { IssueLocation } from "./IssueLocation";
import { Label } from "./Label";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { ReactionGroup } from "./ReactionGroup";
import { SyncNode, SyncNodeTableSpecification } from "./SyncNode";
import { AddedToComponentEvent } from "./timelineItems/AddedToComponentEvent";
import { AddedToLocationEvent } from "./timelineItems/AddedToLocationEvent";
import { AssignedEvent } from "./timelineItems/AssignedEvent";
import { Body } from "./timelineItems/Body";
import { CategoryChangedEvent } from "./timelineItems/CategoryChangedEvent";
import { DeletedIssueComment } from "./timelineItems/DeletedIssueComment";
import { IssueComment } from "./timelineItems/IssueComment";
import { IssueTimelineItem } from "./timelineItems/IssueTimelineItem";
import { LinkEvent } from "./timelineItems/LinkEvent";
import { PinnedEvent } from "./timelineItems/PinnedEvent";
import { RemovedFromComponentEvent } from "./timelineItems/RemovedFromComponentEvent";
import { RemovedFromLocationEvent } from "./timelineItems/RemovedFromLocationEvent";
import { RenamedTitleEvent } from "./timelineItems/RenamedTitleEvent";
import { UnassignedEvent } from "./timelineItems/UnassignedEvent";
import { UnlinkEvent } from "./timelineItems/UnlinkEvent";
import { UnpinnedEvent } from "./timelineItems/UnpinnedEvent";
import { WasLinkedEvent } from "./timelineItems/WasLinkedEvent";
import { User } from "./User";
import MarkdownIt from "markdown-it";
import { config } from "../../config/Config";
import { LabelledEvent } from "./timelineItems/LabelledEvent";
import { UnlabelledEvent } from "./timelineItems/UnlabelledEvent";
import { StartDateChangedEvent } from "./timelineItems/StartDateChangedEvent";
import { DueDateChangedEvent } from "./timelineItems/DueDateChangedEvent";
import { MarkedAsDuplicateEvent } from "./timelineItems/MarkedAsDuplicateEvent";
import { UnmarkedAsDuplicateEvent } from "./timelineItems/UnmarkedAsDuplicateEvent";
import { ClosedEvent } from "./timelineItems/ClosedEvent";
import { ReopenedEvent } from "./timelineItems/ReopenedEvent";
import { PriorityChangedEvent } from "./timelineItems/PriorityChangedEvent";
import { SyncMetadata } from "./SyncMetadata";
import { SortedNodeListProperty } from "./properties/SortedNodeListProperty";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { IssuePriority } from "./enums/IssuePriority";
import { IssueCategory } from "./enums/IssueCategory";
import { Artifact } from "./Artifact";
import { LoadArtifactsCommand } from "../database/commands/load/nodes/LoadArtifactsCommand";
import { NonFunctionalConstraint } from "./NonFunctionalConstraint";
import { LoadNonFunctionalConstraintsCommand } from "../database/commands/load/nodes/LoadNonFunctionalConstraintsCommand";
import { AddedArtifactEvent } from "./timelineItems/AddedArtifactEvent";
import { RemovedArtifactEvent } from "./timelineItems/RemovedArtifactEvent";
import { AddedNonFunctionalConstraintEvent } from "./timelineItems/AddedNonFunctionalConstraintEvent";
import { RemovedNonFunctionalConstraintEvent } from "./timelineItems/RemovedNonFunctionalConstraintEvent";
import { Comment } from "./Comment";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { CommentIssueTimelineItem } from "./timelineItems/CommentIssueTimelineItem";


/**
 * a table specification for an Issue
 * does not specifiy the metadata, because this is up to the save method
 */
export const IssueTableSpecification: NodeTableSpecification<Issue>
    = new NodeTableSpecification<Issue>("issue", SyncNodeTableSpecification,
        RowSpecification.fromProperty("title", "title"),
        RowSpecification.fromProperty("is_open", "isOpen"),
        RowSpecification.fromProperty("is_duplicate", "isDuplicate"),
        RowSpecification.fromProperty("category", "category"),
        RowSpecification.fromProperty("start_date", "startDate"),
        RowSpecification.fromProperty("due_date", "dueDate"),
        RowSpecification.fromProperty("estimated_time", "estimatedTime"),
        RowSpecification.fromProperty("spent_time", "spentTime"),
        RowSpecification.fromProperty("updated_at", "updatedAt"),
        RowSpecification.fromProperty("priority", "priority"),
        new RowSpecification("body_id", issue => issue.bodyTimelineItem.id));


/**
 * An issue
 */
export class Issue extends SyncNode<Issue> implements Comment {

    private _title: string;

    private _isOpen: boolean;

    private _isDuplicate: boolean;

    private _category: IssueCategory;

    private _priority: IssuePriority;

    private _startDate?: Date;

    private _dueDate?: Date;

    private _estimatedTime?: number;

    private _spentTime?: number;

    private _updatedAt: Date;

    private readonly _body: Body; 

    /**
     * Gets the Body TimelineItem
     * Should only be used for internal purposes
     */
    get bodyTimelineItem(): Body {
        return this._body;
    }

    /**
     * property with all IssueTimelineItems
     */
    public readonly timelineProperty: SortedNodeListProperty<IssueTimelineItem, Issue>;

    /**
     * specification for timelineProperty
     */
    private static readonly timelinePropertySpecification: NodeListPropertySpecification<IssueTimelineItem, Issue>
        = NodeListPropertySpecification.loadDynamic<IssueTimelineItem, Issue>(LoadRelationCommand.fromManySide("issue_timeline_item", "issue"),
            (ids, issue) => {
                const command = new LoadIssueTimelineItemsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssueTimelineItemsCommand(true);
                command.onIssues = [issue.id];
                return command;
            })
            .notifyChanged((timelineItem, issue) => timelineItem.issueProperty)
            .noSave();

    /**
     * property with all participants of the Issue
     */
    public readonly participantsProperty: NodeListProperty<User, Issue>;

    /**
     * specification for participantsProperty
     */
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
        = NodeListPropertySpecification.loadDynamic<IssueLocation, Issue>(LoadRelationCommand.fromSecundary("issue_location", "issue"),
            (ids, issue) => {
                const command = new LoadIssueLocationsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssueLocationsCommand(true);
                command.hasIssueOnLocation = [issue.id];
                return command;
            })
            .notifyChanged((issueLocation, issue) => issueLocation.issuesOnLocationProperty)
            .noSave();

    public readonly componentsProperty: NodeListProperty<Component, Issue>;

    private static readonly componentsPropertySpecification: NodeListPropertySpecification<Component, Issue>
        = NodeListPropertySpecification.loadDynamic<Component, Issue>(LoadRelationCommand.fromSecundary("component", "issue"),
            (ids, issue) => {
                const command = new LoadComponentsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadComponentsCommand(true);
                command.hasIssue = [issue.id];
                return command;
            })
            .notifyChanged((issueLocation, issue) => issueLocation.issuesProperty)
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
        = NodeListPropertySpecification.loadDynamic<Component, Issue>(LoadRelationCommand.fromSecundary("component", "pinned_issue"),
            (ids, issue) => {
                const command = new LoadComponentsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadComponentsCommand(true);
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
        = NodeListPropertySpecification.loadDynamic<Issue, Issue>(LoadRelationCommand.fromPrimary("issue", "linked_issue"),
            (ids, issue) => {
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssuesCommand(true);
                command.linkedByIssues = [issue.id];
                return command;
            })
            .notifyChanged((linksToIssue, issue) => linksToIssue.linkedByIssuesProperty)
            .saveOnPrimary("issue", "linked_issue");

    /**
     * Property conaining all issues that are linked to by this issue (where this issue is the __destination__)
     * do NOT add a linked issue via this property
     */
    public readonly linkedByIssuesProperty: NodeListProperty<Issue, Issue>;

    /**
     * Specification for the linkedTo property
     */
    private static readonly linkedByIssuesPropertySpecification: NodeListPropertySpecification<Issue, Issue>
        = NodeListPropertySpecification.loadDynamic<Issue, Issue>(LoadRelationCommand.fromSecundary("issue", "linked_issue"),
            (ids, issue) => {
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadIssuesCommand(true);
                command.linkedByIssues = [issue.id];
                return command;
            })
            .notifyChanged((linkedByIssue, issue) => linkedByIssue.linksToIssuesProperty)
            .noSave();

    /**
     * Property conaining all labels currently assigned to this issue
     * do NOT assign a label to an issue via this property
     */
    public readonly labelsProperty: NodeListProperty<Label, Issue>;

    /**
     * Specification for the labelsProperty property
     */
    private static readonly labelsPropertySpecification: NodeListPropertySpecification<Label, Issue>
        = NodeListPropertySpecification.loadDynamic<Label, Issue>(LoadRelationCommand.fromPrimary("issue", "label"),
            (ids, issue) => {
                const command = new LoadLabelsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadLabelsCommand(true);
                command.assignedToIssues = [issue.id];
                return command;
            })
            .notifyChanged((label, issue) => label.issuesProperty)
            .saveOnPrimary("issue", "label");

    /**
     * Property conaining all Artifacts currently assigned to this issue
     * do NOT assign an Artifact to an issue via this property
     */
    public readonly artifactsProperty: NodeListProperty<Artifact, Issue>;

    /**
     * Specification for the artifactsProperty property
     */
    private static readonly artifactsPropertySpecification: NodeListPropertySpecification<Artifact, Issue>
        = NodeListPropertySpecification.loadDynamic<Artifact, Issue>(LoadRelationCommand.fromPrimary("issue", "artifact"),
            (ids, issue) => {
                const command = new LoadArtifactsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadArtifactsCommand(true);
                command.assignedToIssues = [issue.id];
                return command;
            })
            .notifyChanged((artifact, issue) => artifact.issuesProperty)
            .saveOnPrimary("issue", "artifact");

    /**
     * property with all NonFunctionalConstraints
     */
    public readonly nonFunctionalConstraintsProperty: NodeListProperty<NonFunctionalConstraint, Issue>;

    /**
     * specification for nonFunctionalConstraintsProperty
     */
    private static readonly nonFunctionalConstraintsPropertySpecification: NodeListPropertySpecification<NonFunctionalConstraint, Issue>
        = NodeListPropertySpecification.loadDynamic<NonFunctionalConstraint, Issue>(LoadRelationCommand.fromManySide("non_functional_constraint", "issue_id"),
            (ids, issue) => {
                const command = new LoadNonFunctionalConstraintsCommand(true);
                command.ids = ids;
                return command;
            },
            issue => {
                const command = new LoadNonFunctionalConstraintsCommand(true);
                command.onIssues = [issue.id];
                return command;
            })
            .notifyChanged((timelineItem, issue) => timelineItem.issueProperty)
            .noSave();


    //#region Comment properties and functions

    /**
     * @see {@link Body.body}
     */
    public get body(): string {
        return this._body.body;
    }

    /**
     * @see {@link Body.setBody}
     */
    public async setBody(value: string, atDate: Date, asUser?: User): Promise<void> {
        this._body.setBody(value, atDate, asUser);
    }

    /**
     * @see {@link Body.bodyRendered}
     */
    public async bodyRendered(): Promise<string> {
        return this._body.bodyRendered();
    }

    /**
     * @see {@link Body.reactionsProperty}
     */
    public get reactionsProperty(): NodeListProperty<ReactionGroup, CommentIssueTimelineItem> {
        return this._body.reactionsProperty;
    }

    /**
     * @see {@link Body.editedByProperty}
     */
    public get editedByProperty(): NodeListProperty<User, CommentIssueTimelineItem> {
        return this._body.editedByProperty;
    }

    /**
     * @see {@link Body.lastEditedByProperty}
     */
    public get lastEditedByProperty(): NullableNodeProperty<User, CommentIssueTimelineItem> {
        return this._body.lastEditedByProperty;
    }

    //#endregion

    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    public constructor(databaseManager: DatabaseManager, body: Body, id: string,
        createdById: string | undefined, createdAt: Date, title: string, isOpen: boolean, isDuplicate: boolean, category: IssueCategory,
        startDate: Date | undefined, dueDate: Date | undefined, estimatedTime: number | undefined, spentTime: number | undefined, updateAt: Date, bodyId: string, priority: IssuePriority,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.Issue, databaseManager, IssueTableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);

        this._title = title;
        this._isOpen = isOpen;
        this._isDuplicate = isDuplicate;
        this._category = category;
        this._startDate = startDate;
        this._dueDate = dueDate;
        this._estimatedTime = estimatedTime;
        this._spentTime = spentTime;
        this._updatedAt = updateAt;
        this._priority = priority;
        this._body = body;
        //console.log(body);
        //console.log(body.body);
        this.timelineProperty = new SortedNodeListProperty<IssueTimelineItem, Issue>(databaseManager, Issue.timelinePropertySpecification, this, 
            (a, b) => b.lastEditedAt.getTime() - a.lastEditedAt.getTime());
        this.participantsProperty = new NodeListProperty<User, Issue>(databaseManager, Issue.participantsPropertySpecification, this);
        this.assigneesProperty = new NodeListProperty<User, Issue>(databaseManager, Issue.assigneesPropertySpecification, this);
        this.locationsProperty = new NodeListProperty<IssueLocation, Issue>(databaseManager, Issue.locationsPropertySpecification, this);
        this.componentsProperty = new NodeListProperty<Component, Issue>(databaseManager, Issue.componentsPropertySpecification, this);
        this.pinnedOnProperty = new NodeListProperty<Component, Issue>(databaseManager, Issue.pinnedOnPropertySpecification, this);
        this.linksToIssuesProperty = new NodeListProperty<Issue, Issue>(databaseManager, Issue.linksToIssuesPropertySpecification, this);
        this.linkedByIssuesProperty = new NodeListProperty<Issue, Issue>(databaseManager, Issue.linkedByIssuesPropertySpecification, this);
        this.labelsProperty = new NodeListProperty<Label, Issue>(databaseManager, Issue.labelsPropertySpecification, this);
        this.artifactsProperty = new NodeListProperty<Artifact, Issue>(databaseManager, Issue.artifactsPropertySpecification, this);
        this.nonFunctionalConstraintsProperty = new NodeListProperty<NonFunctionalConstraint, Issue>(databaseManager, Issue.nonFunctionalConstraintsPropertySpecification, this);
    }

    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, title: string, body: string): Promise<Issue> {
        const issueId = databaseManager.idGenerator.generateString();
        const bodyId = databaseManager.idGenerator.generateString();

        const timelineBody = new Body(databaseManager, bodyId, createdBy?.id, createdAt, issueId, body, createdBy?.id, createdAt, title, false, new Date());
        timelineBody.markNew();
        databaseManager.addCachedNode(timelineBody);

        const issue = new Issue(databaseManager, timelineBody, issueId, createdBy?.id, createdAt, title, true, false, IssueCategory.UNCLASSIFIED, undefined, undefined,
            undefined, undefined, createdAt, bodyId, IssuePriority.DEFAULT, false, new Date());
        issue.markNew();
        databaseManager.addCachedNode(issue);

        if (createdBy) {
            await timelineBody.editedByProperty.add(createdBy);
        }

        return issue;
    }


    public get title(): string {
        return this._title;
    }

    /**
     * changes the title and creates a RenamedTitleEvent
     * @param newTitle
     * @param atDate
     * @param asUser
     */
    public async changeTitle(newTitle: string, atDate: Date, asUser?: User): Promise<RenamedTitleEvent | undefined> {
        if (this._title !== newTitle) {
            this._title = newTitle;
            this.markChanged();
            const event = await RenamedTitleEvent.create(this._databaseManager, asUser, atDate, this, this.title, newTitle);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
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

    public async changeCategory(newCategory: IssueCategory, atDate: Date, asUser?: User): Promise<CategoryChangedEvent | undefined> {
        if (newCategory !== this._category) {
            const event = await CategoryChangedEvent.create(this._databaseManager, asUser, atDate, this, this._category, newCategory);
            this._category = newCategory;
            this.markChanged();
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    public get priority(): IssuePriority {
        return this._priority;
    }

    public async changePriority(newPriority: IssuePriority, atDate: Date, asUser?: User): Promise<PriorityChangedEvent | undefined> {
        if (newPriority !== this._priority) {
            const event = await PriorityChangedEvent.create(this._databaseManager, asUser, atDate, this, this._priority, newPriority);
            this._priority = newPriority;
            this.markChanged();
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    public get startDate(): Date | undefined {
        return this._startDate;
    }

    /**
     * sets the new startDate
     * @param newStartDate the new start date or undefined if the startDate should be removed
     * @param atDate
     * @param asUser
     * @returns the event if the start date was changed, otherwise undefined
     */
    public async changeStartDate(newStartDate: Date | undefined, atDate: Date, asUser?: User): Promise<StartDateChangedEvent | undefined> {
        if (newStartDate !== this._startDate) {
            const event = await StartDateChangedEvent.create(this._databaseManager, asUser, atDate, this, this._startDate, newStartDate);
            this._startDate = newStartDate;
            this.markChanged();
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    public get dueDate(): Date | undefined {
        return this._dueDate;
    }

    /**
     * sets the new dueDate
     * @param newDueDate the new due date or undefined if the dueDate should be removed
     * @param atDate
     * @param asUser
     * @returns the event if the due date was changed, otherwise undefined
     */
    public async changeDueDate(newDueDate: Date | undefined, atDate: Date, asUser?: User): Promise<DueDateChangedEvent | undefined> {
        if (newDueDate !== this._dueDate) {
            const event = await DueDateChangedEvent.create(this._databaseManager, asUser, atDate, this, this._dueDate, newDueDate);
            this._dueDate = newDueDate;
            await this.participatedAt(asUser, atDate);
            this.markChanged();
            return event;
        } else {
            return undefined;
        }
    }

    public get estimatedTime(): number | undefined {
        return this._estimatedTime;
    }

    public get spentTime(): number | undefined {
        return this._spentTime;
    }

    /**
     * adds this issue to the specified component
     * also adds the issue to the component as location
     * @param component the component
     * @returns the event if the issue was added, otherwise undefined
     */
    public async addToComponent(component: Component, atDate: Date, asUser?: User): Promise<AddedToComponentEvent | undefined> {
        if (!(await this.componentsProperty.hasId(component.id))) {
            const event = await this.addToComponentInternal(component, atDate, asUser);
            await this.addToLocationInternal(component, atDate, asUser);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * requires that this issue is NOT already on the specified component
     * @param component
     * @param atDate
     * @param asUser
     */
    private async addToComponentInternal(component: Component, atDate: Date, asUser?: User): Promise<AddedToComponentEvent | undefined> {
        await this.componentsProperty.add(component);
        const event = await AddedToComponentEvent.create(this._databaseManager, asUser, atDate, this, component);
        await this.participatedAt(asUser, atDate);
        await Promise.all((await component.projectsProperty.getPublicElements()).map(async project => {
            await project.issuesProperty.add(this);
        }));
        return event;
    }

    /**
     * removes this issue from the specified component
     * throws an error if this issue is already on the specified component
     * @param component the component
     */
    public async removeFromComponent(component: Component, atDate: Date, asUser?: User): Promise<RemovedFromComponentEvent> {
        if ((await this.componentsProperty.getIds()).length === 1) {
            throw new Error("Cannot remove the last component on which an issue is");
        }
        if (await this.componentsProperty.hasId(component.id)) {
            return this.removeFromComponentInternal(component, atDate, asUser);
        } else {
            throw new Error("The issue id not on the specified component");
        }
    }

    /**
     * requires that this issue is on the specified component and that the component can be removed
     * @param component
     * @param atDate
     * @param asUser
     */
    private async removeFromComponentInternal(component: Component, atDate: Date, asUser?: User): Promise<RemovedFromComponentEvent> {
        await this.componentsProperty.remove(component);
        const event = await RemovedFromComponentEvent.create(this._databaseManager, asUser, atDate, this, component);
        await this.participatedAt(asUser, atDate);
        if (await this.locationsProperty.hasId(component.id)) {
            await this.removeFromLocationInternal(component, atDate, asUser);
        }
        const otherLocationsCommand = new LoadComponentInterfacesCommand();
        otherLocationsCommand.hasIssueOnLocation = [this.id];
        const interfacesToRemove = await component.interfacesProperty.getFilteredElements(otherLocationsCommand);
        await Promise.all(interfacesToRemove.map(location => this.removeFromLocationInternal(location, atDate, asUser)));
        if (await this.pinnedOnProperty.hasId(component.id)) {
            await this.unpinOnComponentInternal(component, atDate, asUser);
        }
        return event;
    }

    /**
     * adds this issue to the specified location
     * if the location is a ComponentInterface, the component is added as component if necessary
     * if the location is a Component, the location is added as a component if necessary
     * @param location the IssueLocation to add this issue to
     * @returns the event if the issue was added, otherwise undefined
     */
    public async addToLocation(location: IssueLocation, atDate: Date, asUser?: User): Promise<AddedToLocationEvent | undefined> {
        if (!(await this.locationsProperty.hasId(location.id))) {
            if (location instanceof Component) {
                if (!(await this.componentsProperty.hasId(location.id))) {
                    await this.addToComponentInternal(location as Component, atDate, asUser);
                }
            } else if (location instanceof ComponentInterface) {
                if (!(await this.componentsProperty.hasId((location as ComponentInterface).componentProperty.getId()))) {
                    await this.addToComponentInternal(await (location as ComponentInterface).componentProperty.getPublic(), atDate, asUser);
                }
            } else {
                log(1, "unknown location type: not a Component, not a ComponentInterface");
                log(1, location);
                throw new Error("Internal server error");
            }
            return this.addToLocationInternal(location, atDate, asUser);
        } else {
            return undefined;
        }
    }

    /**
     * requires that this issue is not on the specified location
     * @param location
     * @param atDate
     * @param asUser
     */
    private async addToLocationInternal(location: IssueLocation, atDate: Date, asUser?: User): Promise<AddedToLocationEvent | undefined> {
        await this.locationsProperty.add(location);
        const event = await AddedToLocationEvent.create(this._databaseManager, asUser, atDate, this, location);
        await this.participatedAt(asUser, atDate);
        return event;
    }

    /**
     * removes this issue from the specified location
     * throws an error if this issue is not on the specified location
     * @param component the component
     * @returns the event
     */
    public async removeFromLocation(location: IssueLocation, atDate: Date, asUser?: User): Promise<RemovedFromLocationEvent> {
        if (await this.locationsProperty.hasId(location.id)) {
            return this.removeFromLocationInternal(location, atDate, asUser);
        } else {
            throw new Error("The issue id not on the specified location");
        }
    }

    /**
     * requires that this issue is on the specified location
     * @param location
     * @param atDate
     * @param asUser
     */
    private async removeFromLocationInternal(location: IssueLocation, atDate: Date, asUser?: User): Promise<RemovedFromLocationEvent> {
        await this.locationsProperty.remove(location);
        const event = await RemovedFromLocationEvent.create(this._databaseManager, asUser, atDate, this, location);
        await this.participatedAt(asUser, atDate);
        return event;
    }

    /**
     * links this issue to the provided issue, if possible
     * @param linkedIssue the issue to link this issue to
     * @param atDate
     * @param asUser
     */
    public async addLinkedIssue(linkedIssue: Issue, atDate: Date, asUser?: User): Promise<LinkEvent | undefined> {
        if (!(await this.linksToIssuesProperty.hasId(linkedIssue.id))) {
            await this.linksToIssuesProperty.add(linkedIssue);
            await WasLinkedEvent.create(this._databaseManager, asUser, atDate, linkedIssue, this);
            const event = await LinkEvent.create(this._databaseManager, asUser, atDate, this, linkedIssue);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * links this issue to the provided issue, if possible
     * otherwise it throws an error
     * @param linkedIssue the issue to link this issue to
     * @param atDate
     * @param asUser
     */
    public async removeLinkedIssue(unlinkedIssue: Issue, atDate: Date, asUser?: User): Promise<UnlinkEvent> {
        if ((await this.linksToIssuesProperty.hasId(unlinkedIssue.id))) {
            await this.linksToIssuesProperty.remove(unlinkedIssue);
            await WasLinkedEvent.create(this._databaseManager, asUser, atDate, unlinkedIssue, this);
            const event = await UnlinkEvent.create(this._databaseManager, asUser, atDate, this, unlinkedIssue);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            throw new Error("This issue is not linked to the provided issue");
        }
    }

    /**
     * adds an IssueComment to this Issue
     * @param body the text of the comment
     * @param atDate the date when to add the comment
     * @param asUser the user who adds the comment
     * @returns the added IssueComment
     */
    public async addIssueComment(body: string, atDate: Date, asUser?: User): Promise<IssueComment> {
        const comment = await IssueComment.create(this._databaseManager, asUser, atDate, this, body);
        await this.participatedAt(asUser, atDate);
        return comment;
    }

    /**
     * pinns the issue on the specified component
     * @param component
     * @param atDate
     * @param asUser
     * @returns the PinnedComment
     * @throws error if the issue is not on the specified component
     */
    public async pinOnComponent(component: Component, atDate: Date, asUser?: User): Promise<PinnedEvent | undefined> {
        if (!(await this.componentsProperty.hasId(component.id))) {
            if (!(await this.pinnedOnProperty.hasId(component.id))) {
                await this.pinnedOnProperty.add(component);
                const event = await PinnedEvent.create(this._databaseManager, asUser, atDate, this, component);
                await this.participatedAt(asUser, atDate);
                return event;
            } else {
                return undefined;
            }
        } else {
            throw new Error("Cannot pin issue on component, issue is not on specified component");
        }
    }

    /**
     * unpins this issue on the specified component
     * @param component the component where to unpin this issue
     * @param atDate
     * @param asUser
     * @throws error if the issue is currently not pinned on the specified component
     * @returns the UnpinnedEvent
     */
    public async unpinOnComponent(component: Component, atDate: Date, asUser?: User): Promise<UnpinnedEvent> {
        if (await this.pinnedOnProperty.hasId(component.id)) {
            return this.unpinOnComponentInternal(component, atDate, asUser);
        } else {
            throw new Error("Cannon unpin the issue on the specified component, issue is currently not pinned on the specified component");
        }
    }

    /**
     * requires that this issue is currently pinned on the specified component
     * @param component
     * @param atDate
     * @param asUser
     */
    private async unpinOnComponentInternal(component: Component, atDate: Date, asUser?: User): Promise<UnpinnedEvent> {
        await this.pinnedOnProperty.remove(component);
        const event = await UnpinnedEvent.create(this._databaseManager, asUser, atDate, this, component);
        await this.participatedAt(asUser, atDate);
        return event;
    }

    /**
     * delets an issueComment
     * @param issueComment
     * @param atDate
     * @param asUser
     */
    public async deleteComment(issueComment: IssueComment, atDate: Date, asUser: User): Promise<DeletedIssueComment | undefined> {
        if (!issueComment.isDeleted) {
            await issueComment.setBody("", atDate);
            const deletedIssueComment = await DeletedIssueComment.create(this._databaseManager, await issueComment.createdBy(), issueComment.createdAt, this, asUser, atDate);
            await issueComment.markDeleted();
            await this.participatedAt(asUser, atDate);
            return deletedIssueComment;
        } else {
            return undefined;
        }
    }

    /**
     * Add/Assign a label to this issue
     *
     * @param label The label node to be added to the issue
     * @param atDate The date at which the label was added
     * @param asUser The user who added the label
     */
    public async addLabel(label: Label, atDate: Date, asUser?: User): Promise<LabelledEvent | undefined> {
        if (!(await this.labelsProperty.hasId(label.id))) {
            await this.labelsProperty.add(label);
            const event = await LabelledEvent.create(this._databaseManager, asUser, atDate, this, label);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * Remove/Unassign a label from this issue
     *
     * @param label The label node to be added to the issue
     * @param atDate The date at which the label was added
     * @param asUser The user who added the label
     */
    public async removeLabel(label: Label, atDate: Date, asUser?: User): Promise<UnlabelledEvent | undefined> {
        if (await this.labelsProperty.hasId(label.id)) {
            await this.labelsProperty.remove(label);
            const event = await UnlabelledEvent.create(this._databaseManager, asUser, atDate, this, label);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            throw new Error("The given label is currently not assigned to this issue");
        }
    }

    /**
     * Add/Assign a artifact to this issue
     *
     * @param artifact The artifact node to be added to the issue
     * @param atDate The date at which the artifact was added
     * @param asUser The user who added the artifact
     */
    public async addArtifact(artifact: Artifact, atDate: Date, asUser?: User): Promise<AddedArtifactEvent | undefined> {
        if (!(await this.artifactsProperty.hasId(artifact.id))) {
            await this.artifactsProperty.add(artifact);
            const event = await AddedArtifactEvent.create(this._databaseManager, asUser, atDate, this, artifact);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * Remove/Unassign a artifact from this issue
     *
     * @param artifact The artifact node to be added to the issue
     * @param atDate The date at which the artifact was added
     * @param asUser The user who added the artifact
     */
    public async removeArtifact(artifact: Artifact, atDate: Date, asUser?: User): Promise<RemovedArtifactEvent | undefined> {
        if (await this.artifactsProperty.hasId(artifact.id)) {
            await this.artifactsProperty.remove(artifact);
            const event = await RemovedArtifactEvent.create(this._databaseManager, asUser, atDate, this, artifact);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            throw new Error("The given artifact is currently not assigned to this issue");
        }
    }

    /**
     * Add/Assign a nonfunctionalconstraint to this issue
     *
     * @param nonFunctionalConstraint The nonfunctionalconstraint node to be added to the issue
     * @param atDate The date at which the nonfunctionalconstraint was added
     * @param asUser The user who added the nonfunctionalconstraint
     */
    public async addNonFunctionalConstraint(nonFunctionalConstraint: NonFunctionalConstraint, atDate: Date, asUser?: User): Promise<AddedNonFunctionalConstraintEvent | undefined> {
        if (nonFunctionalConstraint.issueProperty.getId() !== this.id) {
            throw new Error("the specified NonFunctionalConstraint is not part of this Issue");
        }
        if (!nonFunctionalConstraint.isActive) {
            await this.nonFunctionalConstraintsProperty.add(nonFunctionalConstraint);
            const event = await AddedNonFunctionalConstraintEvent.create(this._databaseManager, asUser, atDate, this, nonFunctionalConstraint);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * Remove/Unassign a nonfunctionalconstraint from this issue
     *
     * @param nonFunctionalConstraint The nonfunctionalconstraint node to be added to the issue
     * @param atDate The date at which the nonfunctionalconstraint was added
     * @param asUser The user who added the nonfunctionalconstraint
     */
    public async removeNonFunctionalConstraint(nonFunctionalConstraint: NonFunctionalConstraint, atDate: Date, asUser?: User): Promise<RemovedNonFunctionalConstraintEvent | undefined> {
        if (nonFunctionalConstraint.issueProperty.getId() !== this.id) {
            throw new Error("the specified NonFunctionalConstraint is not part of this Issue");
        }
        if (nonFunctionalConstraint.isActive) {
            await this.nonFunctionalConstraintsProperty.remove(nonFunctionalConstraint);
            const event = await RemovedNonFunctionalConstraintEvent.create(this._databaseManager, asUser, atDate, this, nonFunctionalConstraint);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            throw new Error("The given NonFunctionalConstraint is currently not assigned to this issue");
        }
    }

    /**
     * adds a user as assignee to this issue, if not already
     * @param assignee the user to assign
     * @param atDate
     * @param asUser
     * @returns the AssignedEvent if the user was assigned, otherwise undefined
     */
    public async assignUser(assignee: User, atDate: Date, asUser?: User): Promise<AssignedEvent | undefined> {
        if (!(await this.assigneesProperty.hasId(assignee.id))) {
            await this.assigneesProperty.add(assignee);
            const event = await AssignedEvent.create(this._databaseManager, asUser, atDate, this, assignee);
            await this.participatedAt(asUser, atDate);
            await this.participatedAt(assignee, atDate);
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * removes a user as assignee
     * @param assigneeToRemove the user to unassign
     * @param atDate
     * @param asUser
     * @returns the event
     * @throws error if the user was not assigned to this issue
     */
    public async unassignUser(assigneeToRemove: User, atDate: Date, asUser?: User): Promise<UnassignedEvent> {
        if (await this.assigneesProperty.hasId(assigneeToRemove.id)) {
            await this.assigneesProperty.remove(assigneeToRemove);
            const event = await UnassignedEvent.create(this._databaseManager, asUser, atDate, this, assigneeToRemove);
            await this.participatedAt(asUser, atDate);
            return event;
        } else {
            throw new Error("The unser to unassigned in not assigned to the issue");
        }
    }

    /**
     * marks this issue as duplicate, if not already a duplicate
     * @param atDate
     * @param asUser
     * @returns the event if marked, otherwise undefined
     */
    public async markAsDuplicate(atDate: Date, asUser?: User): Promise<MarkedAsDuplicateEvent | undefined> {
        if (!this.isDuplicate) {
            this._isDuplicate = true;
            const event = await MarkedAsDuplicateEvent.create(this._databaseManager, asUser, atDate, this);
            await this.participatedAt(asUser, atDate);
            this.markChanged();
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * unmarks this issue as duplicate, if it is a duplicate
     * @param atDate
     * @param asUser
     * @returns the event if unmarked, otherwise undefined
     */
    public async unmarkAsDuplicate(atDate: Date, asUser?: User): Promise<UnmarkedAsDuplicateEvent | undefined> {
        if (this.isDuplicate) {
            this._isDuplicate = false;
            const event = await UnmarkedAsDuplicateEvent.create(this._databaseManager, asUser, atDate, this);
            await this.participatedAt(asUser, atDate);
            this.markChanged();
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * closed the issue, if not alredy closed
     * @param atDate
     * @param asUser
     * @returns the event if marked, otherwise undefined
     */
    public async close(atDate: Date, asUser?: User): Promise<ClosedEvent | undefined> {
        if (this.isOpen) {
            this._isOpen = false;
            const event = await ClosedEvent.create(this._databaseManager, asUser, atDate, this);
            await this.participatedAt(asUser, atDate);
            this.markChanged();
            return event;
        } else {
            return undefined;
        }
    }

    /**
     * reopens this issue if closed
     * @param atDate
     * @param asUser
     * @returns the event if reopened, otherwise undefined
     */
    public async reopen(atDate: Date, asUser?: User): Promise<ReopenedEvent | undefined> {
        if (!this.isOpen) {
            this._isOpen = true;
            const event = await ReopenedEvent.create(this._databaseManager, asUser, atDate, this);
            await this.participatedAt(asUser, atDate);
            this.markChanged();
            return event;
        } else {
            return undefined;
        }
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

    /**
     * Adds a participant to the participants if provided and sets updatedAt
     * if the provided Date is newer
     * @param participant the participant
     * @param atDate the date at which the participatin occurred
     */
    public async participatedAt(participant?: User, atDate?: Date): Promise<void> {
        if (atDate && this.updatedAt.getTime() < atDate.getTime()) {
            this.updatedAt = atDate;
        }
        if (participant) {
            await this.participantsProperty.add(participant);
        }
    }

}
