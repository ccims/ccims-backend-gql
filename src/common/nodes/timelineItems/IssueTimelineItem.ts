import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { ImsType } from "../ImsSystem";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap, SyncNode, SyncNodeTableSpecification } from "../SyncNode";

/**
 * a table specification for a IssueTimelineItem
 * does not specifiy the metadata, because this is up to the save method
 */
export const IssueTimelineItemTableSpecification: NodeTableSpecification<IssueTimelineItem>
    = new NodeTableSpecification<IssueTimelineItem>("issue_timelineItem", SyncNodeTableSpecification,
        new RowSpecification("issue", timelineItem => timelineItem.issueProperty.getId()));

export class IssueTimelineItem<T extends IssueTimelineItem = any> extends SyncNode<T> {

    /**
     * property for the issue where this timelineItem is on
     */
    public readonly issueProperty: NodeProperty<Issue, IssueTimelineItem>;

    /**
     * specification of issueProperty
     */
    private static readonly issuePropertySpecification: NodePropertySpecification<Issue, IssueTimelineItem>
        = new NodePropertySpecification<Issue, IssueTimelineItem>(
            (id, timelineItem) => {
                const command = new LoadIssuesCommand();
                command.ids = [id];
                return command;
            },
            timelineItem => new GetWithReloadCommand(timelineItem, "issue", new LoadIssuesCommand()),
            (issue, timelineItem) => issue.timelineProperty
        );

    /**
     * Async property getter for issueProperty
     * @returns A promise of the issue this timeline item belongs to
     */
    public async issue(): Promise<Issue> {
        return this.issueProperty.get();
    }


    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, isDeleted, metadata);
        this.issueProperty = new NodeProperty<Issue, IssueTimelineItem>(databaseManager, IssueTimelineItem.issuePropertySpecification, this, issueId);
    }
}

export class IssueTimelineItemType {

    private constructor(public readonly tableName: string) {

    }

    public static ISSUE_COMMENT = new IssueTimelineItemType("issue_timeline_comment");
    public static BODY = new IssueTimelineItemType("issue_timeline_body");
    public static DELETED_ISSUE_COMMENT = new IssueTimelineItemType("issue_timeline_deletedComment");
    public static REFERENCED_BY_OTHER_EVENT = new IssueTimelineItemType("issue_timeline_referencedByOtherEvent");
    public static REFERENCED_BY_ISSUE_EVENT = new IssueTimelineItemType("issue_timeline_referencedByIssueEvent");
    public static LINK_EVENT = new IssueTimelineItemType("issue_timeline_linkEvent");
    public static UNLINK_EVENT = new IssueTimelineItemType("issue_timeline_unlinkEvent");
    public static WAS_LINKED_EVENT = new IssueTimelineItemType("issue_timeline_wasLinkedEvent");
    public static WAS_UNLINKED_EVENT = new IssueTimelineItemType("issue_timeline_wasUnlinkedEvent");
    public static LABELLED_EVENT = new IssueTimelineItemType("issue_timeline_labledEvent");
    public static UNLABELLED_EVENT = new IssueTimelineItemType("issue_timeline_unlabledEvent");
    public static PINNED_EVENT = new IssueTimelineItemType("issue_timeline_pinnedEvent");
    public static UNPINNED_EVENT = new IssueTimelineItemType("issue_timeline_unpinnedEvent");
    public static RENAMED_TITLE_EVENT = new IssueTimelineItemType("issue_timeline_renamedTitleEvent");
    public static CATEGORY_CHANGED_EVENT = new IssueTimelineItemType("issue_timeline_categoryChangedEvent");
    public static ASSIGNED_EVENT = new IssueTimelineItemType("issue_timeline_assignedEvent");
    public static UNASSIGNED_EVENT = new IssueTimelineItemType("issue_timeline_unassignedEvent");
    public static CLOSED_EVENT = new IssueTimelineItemType("issue_timeline_closedEvent");
    public static REOPENED_EVENT = new IssueTimelineItemType("issue_timeline_reopenedEvent");
    public static PRIORITY_CHANGED_EVENT = new IssueTimelineItemType("issue_timeline_priorityChangedEvent");
    public static START_DATE_CHANGED_EVENT = new IssueTimelineItemType("issue_timeline_startDateChangedEvent");
    public static DUE_DATE_CHANGED_EVENT = new IssueTimelineItemType("issue_timeline_dueDateChangedEvent");
    public static ESTIMATED_TIME_CHANGED_EVENT = new IssueTimelineItemType("issue_timeline_estimatedTimeChangedEvent");
    public static ADDED_LOCATION_EVENT = new IssueTimelineItemType("issue_timeline_addedToLocationEvent");
    public static REMOVED_LOCATION_EVENT = new IssueTimelineItemType("issue_timeline_removedFromLocationEvent");
    public static MARKED_AS_DUPLICATE_EVENT = new IssueTimelineItemType("issue_timeline_markedAsDuplicateEvent");
    public static UNMARKED_AS_DUPLICATE_EVENT = new IssueTimelineItemType("issue_timeline_unmarkedAsDuplicateEvent");
    public static ADDED_TO_COMPONENT_EVENT = new IssueTimelineItemType("issue_timeline_addedToComponentEvent");
    public static REMOVED_FROM_COMPONENT_EVENT = new IssueTimelineItemType("issue_timeline_removedFromComponentEvent");
}