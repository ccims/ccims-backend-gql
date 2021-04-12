import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";

const issueTimelineItemTypeConfig: GraphQLEnumTypeConfig = {
    name: "IssueTimelineItemType",
    description: "The type of a timeline item/event so it can be filtered for <sup>(because GraphQL doesn't allow to filter for a type)</sup>",
    values: {
        ISSUE_COMMENT: {
            value: "ISSUE_COMMENT",
            description: "A still visible comment on an issue (not including the actual issue text)"
        },
        DELETED_ISSUE_COMMENT: {
            value: "DELETED_ISSUE_COMMENT",
            description: "A comment that has been deleted by a user. This will contain no text etc., but a message should be shown in place of the comment stating that this is a deleted comment"
        },
        REFERENCED_BY_OTHER_EVENT: {
            value: "REFERENCED_BY_OTHER_EVENT",
            description: "An event when this issue was referenced by an element in an IMS that is not an issue (e.g. in a commit message, pull request etc.)"
        },
        REFERENCED_BY_ISSUE_EVENT: {
            value: "REFERENCED_BY_ISSUE_EVENT",
            description: "An event when this issue was referenced by an other issue in an IMS or the ccims itself"
        },
        LINK_EVENT: {
            value: "LINK_EVENT",
            description: "A link from this issue to another issue was created"
        },
        UNLINK_EVENT: {
            value: "UNLINK_EVENT",
            description: "A link from this issue to another issue was removed"
        },
        WAS_LINKED_EVENT: {
            value: "WAS_LINKED_EVENT",
            description: "An event if this issue was linked to in another issue"
        },
        WAS_UNLINKED_EVENT: {
            value: "WAS_UNLINKED_EVENT",
            description: "An event if the link from another issue to this one was removed"
        },
        LABELLED_EVENT: {
            value: "LABELLED_EVENT",
            description: "A label was added to this issue"
        },
        UNLABELLED_EVENT: {
            value: "UNLABELLED_EVENT",
            description: "A label was removed from tis issue"
        },
        PINNED_EVENT: {
            value: "PINNED_EVENT",
            description: "This issue was pinned as important issue in the ccims.\n\n__This event won't be synced along all subscribed issue management systems__"
        },
        UNPINNED_EVENT: {
            value: "UNPINNED_EVENT",
            description: "This issue was unpinned in the ccims.\n\n__This event won't be synced along all subscribed issue management systems__"
        },
        RENAMED_TITLE_EVENT: {
            value: "RENAMED_TITLE_EVENT",
            description: "Occurs if the title of the issue has been changed"
        },
        CATEGORY_CHANGED_EVENT: {
            value: "CATEGORY_CHANGED_EVENT",
            description: "An event if the category (see `enum IssueCategory`) of the issue has been changed"
        },
        ASSIGNED_EVENT: {
            value: "ASSIGNED_EVENT",
            description: "If a user has been assigned as responsible person for this issue"
        },
        UNASSIGNED_EVENT: {
            value: "UNASSIGNED_EVENT",
            description: "If a user has been unassigned from this issue and is no longer responsible"
        },
        CLOSED_EVENT: {
            value: "CLOSED_EVENT",
            description: "Happens if the issue has been closed by anybody"
        },
        REOPENED_EVENT: {
            value: "REOPENED_EVENT",
            description: "Happens if the issue has been reopened after being closed by anybody.\n\n_This event doesn't occur on the first opening of the issue_"
        },
        PRIORITY_CHANGED_EVENT: {
            value: "PRIORITY_CHANGED_EVENT",
            description: "If the issue priority was changed (see `enum Priority`)"
        },
        START_DATE_CHANGED_EVENT: {
            value: "START_DATE_CHANGED_EVENT",
            description: "An event if the date the issue gets relevant/starts has changed"
        },
        DUE_DATE_CHANGED_EVENT: {
            value: "DUE_DATE_CHANGED_EVENT",
            description: "An event if the date the issue is due on/must be finished by was changed"
        },
        ESTIMATED_TIME_CHANGED_EVENT: {
            value: "ESTIMATED_TIME_CHANGED_EVENT",
            description: "The estimated time required to resolve this issue was updated"
        },
        ADDED_LOCATION_EVENT: {
            value: "ADDED_LOCATION_EVENT",
            description: "Event if the cross component issue was added to another location (another component/another)"
        },
        REMOVED_LOCATION_EVENT: {
            value: "REMOVED_LOCATION_EVENT",
            description: "Event if the cross component issue was removed from a location (another component/another)"
        },
        MARKED_AS_DUPLICATE_EVENT: {
            value: "MARKED_AS_DUPLICATE_EVENT",
            description: "Occurs if this issue was marked as duplicate of some other issue which is known to the ccims.\n\n(if the issue in unknown to the ccims at time of marking it as a duplicate; it's not guaranteed, that the mark will be synced)"
        },
        UNMARKED_AS_DUPLICATE_EVENT: {
            value: "UNMARKED_AS_DUPLICATE_EVENT",
            description: "An event if the issue is no longer a duplicate of another issue"
        },
        ADDED_TO_COMPONENT_EVENT: {
            value: "ADDED_TO_COMPONENT_EVENT",
            description: "An event if the issue has been added to a new component and copied to the components ims (not a issue location)"
        },
        REMOVED_FROM_COMPONENT_EVENT: {
            value: "REMOVED_FROM_COMPONENT_EVENT",
            description: "An event if the issue has been removed from a component and deleted in the components ims (not a issue location)"
        },
        ADDED_ARTIFACT_EVENT: {
            value: "ADDED_ARTIFACT_EVENT",
            description: "An event if an artifact has been added to the issue"
        },
        REMOVED_ARTIFACT_EVENT: {
            value: "REMOVED_ARTIFACT_EVENT",
            description: "An event if an artifact has been removed from the issue"
        },
        ADDED_NON_FUNCTIONAL_CONSTRAINT_EVENT: {
            value: "ADDED_NON_FUNCTIONAL_CONSTRAIN_EVENT",
            description: "An event if a non functional constraint has been added to the issue"
        },
        REMOVED_NON_FUNCTIONAL_CONSTRAIN_EVENT: {
            value: "REMOVED_NON_FUNCTIONAL_CONSTRAIN_EVENT",
            description: "An event if a non functional constraint has been removed from the issue"
        }
    }
};
const GraphQLIssueTimelineItemType = new GraphQLEnumType(issueTimelineItemTypeConfig);
export default GraphQLIssueTimelineItemType;