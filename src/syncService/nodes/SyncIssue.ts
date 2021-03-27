import { CCIMSNode } from "../../common/nodes/CCIMSNode";
import { Issue } from "../../common/nodes/Issue";
import { IssueLocation } from "../../common/nodes/IssueLocation";
import { Label } from "../../common/nodes/Label";
import { NodeType } from "../../common/nodes/NodeType";
import { NodeListProperty } from "../../common/nodes/properties/NodeListProperty";
import { AddedToLocationEvent } from "../../common/nodes/timelineItems/AddedToLocationEvent";
import { AssignedEvent } from "../../common/nodes/timelineItems/AssignedEvent";
import { IssueTimelineItem } from "../../common/nodes/timelineItems/IssueTimelineItem";
import { LabelledEvent } from "../../common/nodes/timelineItems/LabelledEvent";
import { LinkEvent } from "../../common/nodes/timelineItems/LinkEvent";
import { RemovedFromLocationEvent } from "../../common/nodes/timelineItems/RemovedFromLocationEvent";
import { RenamedTitleEvent } from "../../common/nodes/timelineItems/RenamedTitleEvent";
import { UnassignedEvent } from "../../common/nodes/timelineItems/UnassignedEvent";
import { UnlabelledEvent } from "../../common/nodes/timelineItems/UnlabelledEvent";
import { UnlinkEvent } from "../../common/nodes/timelineItems/UnlinkEvent";
import { User } from "../../common/nodes/User";
import { fromNewNodeWithMetadata } from "../SyncUpdate";
import { SyncListProperty } from "../properties/SyncListProperty";
import { SyncListPropertySpecification } from "../properties/SyncListPropertySpecification";
import { SyncProperty } from "../properties/SyncProperty";
import { SyncPropertySpecification } from "../properties/SyncPropertySpecification";
import { SyncNodeWrapper } from "./SyncNodeWrapper";
import { SyncNodeProviderSpecification } from "../providers/SyncNodeProviderSpecification";
import { IssueComment } from "../../common/nodes/timelineItems/IssueComment";
import { SyncComment } from "./SyncComment";
import { LoadIssueCommentsCommand } from "../../common/database/commands/load/nodes/timeline/LoadIssueCommentsCommand";
import { SyncNodeProvider } from "../providers/SyncNodeProvider";
import { PropertySyncNodeProvider } from "../providers/PropertySyncNodeProvider";
import { Body } from "../../common/nodes/timelineItems/Body";

/**
 * Sync wraüüer for Issue
 */
export class SyncIssue extends SyncNodeWrapper<Issue> {

    /**
     * Specification for the commentsProvider
     */
    private static readonly commentsProviderSpecification: SyncNodeProviderSpecification<IssueComment, SyncComment<IssueComment>, LoadIssueCommentsCommand> = {
        createWrapper: comment => new SyncComment(comment),
        createCommand: modifiedSince => {
            const command = new LoadIssueCommentsCommand();
            command.modifiedSince = modifiedSince;
            return command;
        }
    };

    /**
     * IssueComments property: provides all IssueComments, but not the Body (which is a Comment, but not an IssueComment)
     */
    public readonly commentsProvider: SyncNodeProvider<IssueComment, SyncComment<IssueComment>, LoadIssueCommentsCommand>;

    /**
     * The body of the issue
     */
    private _body?: SyncComment<Body>;

    /**
     * Specification for the labelsProperty
     */
    private static readonly labelsPropertySpecification : SyncListPropertySpecification<Label, Issue, SyncIssue> = {
        applyAdd: async (item, node) => fromNewNodeWithMetadata(await node.node.addLabel(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyAddHistoric: async (item, node) => fromNewNodeWithMetadata(await LabelledEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        applyRemove: async (item, node) => fromNewNodeWithMetadata(await node.node.removeLabel(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyRemoveHistoric: async (item, node) => fromNewNodeWithMetadata(await UnlabelledEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        getCurrentStatus: getCurrentListPropertyStatus(
            node => node.node.labelsProperty, 
            NodeType.LabelledEvent,
            (event, label) => (event as LabelledEvent).labelProperty.getId() === label.id,
            NodeType.UnlabelledEvent,
            (event, label) => (event as UnlabelledEvent).labelProperty.getId() === label.id
        )
    }

    /**
     * property to add / remove labels
     */
    public readonly labelsProperty: SyncListProperty<Label, Issue, SyncIssue>;


    /**
     * Specification for the linksToIssuesProperty
     */
    private static readonly linksToIssuesPropertySpecification : SyncListPropertySpecification<Issue, Issue, SyncIssue> = {
        applyAdd: async (item, node) => fromNewNodeWithMetadata(await node.node.addLinkedIssue(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyAddHistoric: async (item, node) => fromNewNodeWithMetadata(await LinkEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        applyRemove: async (item, node) => fromNewNodeWithMetadata(await node.node.removeLinkedIssue(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyRemoveHistoric: async (item, node) => fromNewNodeWithMetadata(await UnlinkEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        getCurrentStatus: getCurrentListPropertyStatus(
            node => node.node.linksToIssuesProperty, 
            NodeType.LinkEvent,
            (event, issue) => (event as LinkEvent).issueProperty.getId() === issue.id,
            NodeType.UnlinkEvent,
            (event, issue) => (event as UnlinkEvent).issueProperty.getId() === issue.id
        )
    }

    /**
     * property to link / unlink issues
     */
    public readonly linksToIssuesProperty: SyncListProperty<Issue, Issue, SyncIssue>;

    /**
     * Specification for the locationsProperty
     */
    private static readonly locationsPropertySpecification : SyncListPropertySpecification<IssueLocation, Issue, SyncIssue> = {
        applyAdd: async (item, node) => fromNewNodeWithMetadata(await node.node.addToLocation(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyAddHistoric: async (item, node) => fromNewNodeWithMetadata(await AddedToLocationEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        applyRemove: async (item, node) => fromNewNodeWithMetadata(await node.node.removeFromLocation(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyRemoveHistoric: async (item, node) => fromNewNodeWithMetadata(await RemovedFromLocationEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        getCurrentStatus: getCurrentListPropertyStatus(
            node => node.node.locationsProperty, 
            NodeType.AddedToLocationEvent,
            (event, location) => (event as AddedToLocationEvent).issueLocationProperty.getId() === location.id,
            NodeType.RemovedFromLocationEvent,
            (event, location) => (event as RemovedFromLocationEvent).issueLocationProperty.getId() === location.id
        )
    }

    /**
     * property to add / remove labels
     */
    public readonly locationsProperty: SyncListProperty<IssueLocation, Issue, SyncIssue>;


    /**
     * Specification for the assigneesProperty
     */
    private static readonly assigneesPropertySpecification: SyncListPropertySpecification<User, Issue, SyncIssue> = {
        applyAdd: async (item, node) => fromNewNodeWithMetadata(await node.node.assignUser(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyAddHistoric: async (item, node) => fromNewNodeWithMetadata(await AssignedEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        applyRemove: async (item, node) => fromNewNodeWithMetadata(await node.node.unassignUser(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyRemoveHistoric: async (item, node) => fromNewNodeWithMetadata(await UnassignedEvent.create(node.node.databaseManager, item.asUser, item.atDate ?? new Date(), node.node, item.value), item.metadata),
        getCurrentStatus: getCurrentListPropertyStatus(
            node => node.node.assigneesProperty, 
            NodeType.AssignedEvent,
            (event, assignee) => (event as AssignedEvent).assigneeProperty.getId() === assignee.id,
            NodeType.UnassignedEvent,
            (event, assignee) => (event as UnassignedEvent).removedAssigneeProperty.getId() === assignee.id
        )
    }

    /**
     * property to add / remove assignees
     */
    public readonly assigneesProperty: SyncListProperty<User, Issue, SyncIssue>;


    /**
     * Specification for the titleProperty
     */
    private static readonly titlePropertySpecification: SyncPropertySpecification<string, Issue, SyncIssue> = {
        apply: async (item, node) => fromNewNodeWithMetadata(await node.node.changeTitle(item.value, item.atDate ?? new Date(), item.asUser), item.metadata),
        applyHistoric: async (item, node) => fromNewNodeWithMetadata(await RenamedTitleEvent.create(
                node.node.databaseManager, 
                item.asUser, 
                item.atDate ?? new Date(), 
                node.node, 
                await node.getTitleAt(item.atDate ?? new Date()), 
                item.value)
            , item.metadata),
        getCurrentStatus: async node => {
            return {
                currentValue: node.node.title,
                lastUpdatedAt: (await getLatestTimelineItem(node, NodeType.RenamedTitleEvent, () => true))?.lastEditedAt ?? node.node.createdAt
            };
        }
    };

    /**
     * property to change the title
     */
    public readonly titleProperty: SyncProperty<string, Issue, SyncIssue>;
    


    /**
     * Creates a new SyncIssue based on the provided issue
     * @param node the underlaying node
     */
    public constructor(node: Issue) {
        super(node);

        this.commentsProvider = this.registerSyncModifiable(new PropertySyncNodeProvider(SyncIssue.commentsProviderSpecification, node.timelineProperty));

        this.labelsProperty = this.registerSyncModifiable(new SyncListProperty(SyncIssue.labelsPropertySpecification, this));
        this.locationsProperty = this.registerSyncModifiable(new SyncListProperty(SyncIssue.locationsPropertySpecification, this));
        this.assigneesProperty = this.registerSyncModifiable(new SyncListProperty(SyncIssue.assigneesPropertySpecification, this));
        this.linksToIssuesProperty = this.registerSyncModifiable(new SyncListProperty(SyncIssue.linksToIssuesPropertySpecification, this));

        this.titleProperty = this.registerSyncModifiable(new SyncProperty(SyncIssue.titlePropertySpecification, this));
    }

    /**
     * Gets the title at a specific point in time
     * @param date the timestamp for the queried state
     * @returns the title of the issue at the speicified point in time
     */
    private async getTitleAt(date: Date): Promise<string> {
        const renamedTitleEvent = await getLatestTimelineItem(this, NodeType.RenamedTitleEvent, item => item.lastEditedAt.getTime() < date.getTime());
        if (renamedTitleEvent !== undefined) {
            return (renamedTitleEvent as RenamedTitleEvent).newTitle;
        } else {
            return (await this.node.bodyProperty.get()).initialTitle;
        }
    }

    /**
     * Gets a sync wrapper for the body of the 
     */
    public async body(): Promise<SyncComment<Body>> {
        if (this._body === undefined) {
            this._body = this.registerSyncModifiable(new SyncComment(await this.node.bodyProperty.get()));
        }
        return this._body;
    }

}

/**
 * Get a function to determine the current status of a ListProperty
 * @param propertyProvider gets the property from the Issue
 * @param addedTimelineItemType the timeline item type for added events
 * @param addedTimelineItemFilter filter to filter added timeline item events
 * @param removedTimelineItemType the timeline item type for removed events
 * @param removedTimelineItemFilter filter to filter removed timeline item events
 * @returns a function to determine the status of a list property
 */
function getCurrentListPropertyStatus<T extends CCIMSNode<any>>(
    propertyProvider: (node: SyncIssue) => NodeListProperty<T, Issue>,
    addedTimelineItemType: NodeType,
    addedTimelineItemFilter: (item: IssueTimelineItem, value: T) => boolean,
    removedTimelineItemType: NodeType,
    removedTimelineItemFilter: (item: IssueTimelineItem, value: T) => boolean,
) : (item: T, node: SyncIssue) => Promise<{ currentStatus: boolean, lastUpdatedAt?: Date}> {
    return async (item: T, node: SyncIssue) => {
        const property = propertyProvider(node);
        if (property.hasId(item.id)) {
            return {
                currentStatus: true,
                lastUpdatedAt: (await getLatestTimelineItem(node, addedTimelineItemType, timelineItem => addedTimelineItemFilter(timelineItem, item)))?.lastEditedAt
            };
        } else {
            return {
                currentStatus: false,
                lastUpdatedAt: (await getLatestTimelineItem(node, removedTimelineItemType, timelineItem => removedTimelineItemFilter(timelineItem, item)))?.lastEditedAt
            };
        }
    }
}

/**
 * Get the lastModifiedAt entry of the last timeline item
 * @param issue the issue with the property
 * @param timelineItemType the searched timeline item type
 * @param timelineItemFilter additional filter to filter timeline items
 * @returns the date when the timeline item was last modified
 */
async function getLatestTimelineItem (
    issue: SyncIssue,
    timelineItemType: NodeType,
    timelineItemFilter: (item: IssueTimelineItem) => boolean
): Promise<IssueTimelineItem | undefined> {
    const timelineItems = await issue.node.timelineProperty.getSortedElements();
    for (let i = timelineItems.length - 1; i >= 0; i--) {
        const item = timelineItems[i];
        if (item.type === timelineItemType && timelineItemFilter(item)) {
            return item;
        }
    }
    return undefined;
}