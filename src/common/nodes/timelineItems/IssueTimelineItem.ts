import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadata } from "../SyncMetadata";
import { SyncNode, SyncNodeTableSpecification } from "../SyncNode";

/**
 * a table specification for a IssueTimelineItem
 * does not specifiy the metadata, because this is up to the save method
 */
export const IssueTimelineItemTableSpecification: NodeTableSpecification<IssueTimelineItem>
    = new NodeTableSpecification<IssueTimelineItem>("issue_timeline_item", SyncNodeTableSpecification,
        new RowSpecification("issue_id", timelineItem => timelineItem.issueProperty.getId()));

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
                const command = new LoadIssuesCommand(true);
                command.ids = [id];
                return command;
            },
            timelineItem => new GetWithReloadCommand(timelineItem, "issue_id", new LoadIssuesCommand(true)),
            (issue, timelineItem) => issue.timelineProperty
        );

    /**
     * Async property getter for issueProperty
     * @returns A promise of the issue this timeline item belongs to
     */
    public async issue(): Promise<Issue> {
        return this.issueProperty.getPublic();
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
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this.issueProperty = new NodeProperty<Issue, IssueTimelineItem>(databaseManager, IssueTimelineItem.issuePropertySpecification, this, issueId);
    }
}

export class IssueTimelineItemType {

    private constructor(public readonly tableName: string) {

    }

    public static ISSUE_COMMENT = new IssueTimelineItemType("comment");
    public static BODY = new IssueTimelineItemType("body");
    public static DELETED_ISSUE_COMMENT = new IssueTimelineItemType("deletedComment");
    public static REFERENCED_BY_OTHER_EVENT = new IssueTimelineItemType("referencedByOtherEvent");
    public static REFERENCED_BY_ISSUE_EVENT = new IssueTimelineItemType("referencedByIssueEvent");
    public static LINK_EVENT = new IssueTimelineItemType("linkEvent");
    public static UNLINK_EVENT = new IssueTimelineItemType("unlinkEvent");
    public static WAS_LINKED_EVENT = new IssueTimelineItemType("wasLinkedEvent");
    public static WAS_UNLINKED_EVENT = new IssueTimelineItemType("wasUnlinkedEvent");
    public static LABELLED_EVENT = new IssueTimelineItemType("labelledEvent");
    public static UNLABELLED_EVENT = new IssueTimelineItemType("unlabelledEvent");
    public static PINNED_EVENT = new IssueTimelineItemType("pinnedEvent");
    public static UNPINNED_EVENT = new IssueTimelineItemType("unpinnedEvent");
    public static RENAMED_TITLE_EVENT = new IssueTimelineItemType("renamedTitleEvent");
    public static CATEGORY_CHANGED_EVENT = new IssueTimelineItemType("categoryChangedEvent");
    public static ASSIGNED_EVENT = new IssueTimelineItemType("assignedEvent");
    public static UNASSIGNED_EVENT = new IssueTimelineItemType("unassignedEvent");
    public static CLOSED_EVENT = new IssueTimelineItemType("closedEvent");
    public static REOPENED_EVENT = new IssueTimelineItemType("reopenedEvent");
    public static PRIORITY_CHANGED_EVENT = new IssueTimelineItemType("priorityChangedEvent");
    public static START_DATE_CHANGED_EVENT = new IssueTimelineItemType("startDateChangedEvent");
    public static DUE_DATE_CHANGED_EVENT = new IssueTimelineItemType("dueDateChangedEvent");
    public static ESTIMATED_TIME_CHANGED_EVENT = new IssueTimelineItemType("estimatedTimeChangedEvent");
    public static ADDED_LOCATION_EVENT = new IssueTimelineItemType("addedToLocationEvent");
    public static REMOVED_LOCATION_EVENT = new IssueTimelineItemType("removedFromLocationEvent");
    public static MARKED_AS_DUPLICATE_EVENT = new IssueTimelineItemType("markedAsDuplicateEvent");
    public static UNMARKED_AS_DUPLICATE_EVENT = new IssueTimelineItemType("unmarkedAsDuplicateEvent");
    public static ADDED_TO_COMPONENT_EVENT = new IssueTimelineItemType("addedToComponentEvent");
    public static REMOVED_FROM_COMPONENT_EVENT = new IssueTimelineItemType("removedFromComponentEvent");
    public static ADDED_ARTIFACT_EVENT = new IssueTimelineItemType("addedArtifactEvent");
    public static REMOVED_ARTIFACT_EVENT = new IssueTimelineItemType("removedArtifactEvent");
    public static ADDED_NON_FUNCTIONAL_CONSTRAINT = new IssueTimelineItemType("addedNonFunctionalConstraint");
    public static REMOVED_NON_FUNCTIONAL_CONSTRAINT_EVENT = new IssueTimelineItemType("removedNonFunctionalConstraint");
}