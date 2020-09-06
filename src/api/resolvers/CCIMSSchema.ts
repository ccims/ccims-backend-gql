import { GraphQLSchema } from "graphql"
import mutation from "./mutation";
import query from "./query";

let ccimsSchema = new GraphQLSchema({
    mutation,
    query
});
export default ccimsSchema;

/*
type Mutation {
    createIssue(input: CreateIssueInput!): CreateIssuePayload
    addIssueComment(input: AddIssueCommentInput!): AddIssueCommentPayload
    deleteIssueComment(input: DeleteIssueCommentInput!): DeleteIssueCommentPayload
    linkIssue(input: LinkIssueInput!): LinkIssuePayload
    unlinkIssue(input: UnlinkIssueInput!): UnlinkIssuePayload
    addLabel(input: AddLabelInput!): AddLabelPayload
    removeLabel(input: RemoveLabelInput!): RemoveLabelPayload
    pinIssue(input: PinIssueInput!): PinIssuePayload
    unpinIssue(input: UnpinIssueInput!): UnpinIssuePayload
    renameIssueTitle(input: RenameIssueTitleInput!): RenameIssueTitlePayload
    changeIssueCategory(input: ChangeIssueCategoryInput!): ChangeIssueCategoryPayload
    addAssignee(input: AddAssigneeInput!): AddAssigneePayload
    removeAssignee(input: RemoveAssigneeInput!): RemoveAssigneePayload
    closeIssue(input: CloseIssueInput!): CloseIssuePayload
    reopenIssue(input: ReopenIssueInput!): ReopenIssuePayload
    changeIssuePriority(input: ChangeIssuePriorityInput!): ChangeIssuePriorityPayload
    changeIssueStartDate(input: ChangeIssueStartDateInput!): ChangeIssueStartDatePayload
    changeIssueDueDate(input: ChangeIssueDueDateInput!): ChangeIssueDueDatePayload
    changeIssueEstimatedTime(input: ChangeIssueEstimatedTimeInput!): ChangeIssueEstimatedTimePayload
    addIssueToLocation(input: AddIssueToLocationInput!): AddIssueToLocationPayload
    removeIssueFromLocation(input: RemoveIssueFromLocationInput!): RemoveIssueFromLocationPayload
    addIssueToComponent(input: AddIssueToComponentInput!): AddIssueToComponentPayload
    removeIssueFromComponent(input: RemoveIssueFromComponentInput!): RemoveIssueFromComponentPayload
    markIssueAsDuplicate(input: MarkIssueAsDuplicateInput!): MarkIssueAsDuplicatePayload
    unmarkIssueAsDuplicate(input: UnmarkIssueAsDuplicateInput!): UnmarkIssueAsDuplicatePayload
    addReaction(input: AddReactionInput!): AddReactionPayload
    removeReaction(input: RemoveReactionInput!): RemoveReactionPayload
}

input CreateProjectInput {
        name: String!
        components: [ID!]
        users: [ID!]
        owner: ID!
}

input CreateIssueInput {
    title: String!
    body: String
    componentIDs: [ID!]!
    category: IssueCategory
    labels: [ID!]
    assignees: [ID!]
    locations: [ID!]
    startDate: Date
    dueDate: Date
    estimatedTime: TimeSpan
    clientMutationID: String
}

type CreateIssuePayload {
    clientMutationID: String
    issue: Issue
}

input AddReactionInput {
    clientMutationID: String
    reactionToAdd: String!
}

type AddReactionPayload {
    clientMutationID: String
    reaction: ReactionGroup
    reactionEdge: ReactionGroupEdge
}

input RemoveReactionInput {
    clientMutationID: String
    reactionToRemove: String!
}

type RemoveReactionPayload {
    clientMutationID: String
}

input AddIssueCommentInput {
    body: String!
    clientMutationID: String
    issueID: ID!
}

type AddIssueCommentPayload {
    comment: IssueComment
    clientMutationID: String
    commentEdge: IssueCommentEdge
    timelineEdge: IssueTimelineItemEdge
}

input DeleteIssueCommentInput {
    clientMutationID: String
    issueComment: ID
}

type DeleteIssueCommentPayload {
    clientMutationID: String
    deletedComment: DeletedIssueComment
    timelineEdge: IssueTimelineItemEdge
}

input LinkIssueInput {
    clientMutationID: String,
    issue: ID!
    issueToLink: ID!
}

type LinkIssuePayload {
    clientMutationID: String
    linkedIssue: Issue
    linkedIssueEdge: IssueEdge
    timelineEdge: IssueTimelineItemEdge
}

input UnlinkIssueInput {
    clientMutationID: String,
    issue: ID!
    issueToUnlink: ID!
}

type UnlinkIssuePayload {
    clientMutationID: String
    unlinkedIssue: Issue
    timelineEdge: IssueTimelineItemEdge
}

input AddLabelInput {
    clientMutationID: String
    issue: ID!
    label: ID!
}

type AddLabelPayload {
    clientMutationID: String
    label: Label
    issue: Issue
    event: LabelledEvent
    labelEdge: LabelEdge
    timelineEdge: IssueTimelineItemEdge
}

input RemoveLabelInput {
    clientMutationID: String
    issue: ID!
    label: ID!
}

type RemoveLabelPayload {
    clientMutationID: String
    label: Label
    issue: Issue
    event: UnlabelledEvent
    timelineEdge: IssueTimelineItemEdge
}

input PinIssueInput {
    clientMutationID: String
    issue: ID!
    component: ID!
}

type PinIssuePayload {
    clientMutationID: String
    pinnedIssue: Issue
    component: Component
    event: PinnedEvent
    timelineEdge: IssueTimelineItemEdge
}

input UnpinIssueInput {
    clientMutationID: String
    issue: ID!
    component: ID!
}

type UnpinIssuePayload {
    clientMutationID: String
    unpinnedIssue: Issue
    component: Component
    event: UnpinnedEvent
    timelineEdge: IssueTimelineItemEdge
}

input RenameIssueTitleInput {
    clientMutationID: String
    issue: ID!
    newTitle: String!
}

type RenameIssueTitlePayload {
    clientMutationID: String
    issue: Issue
    event: RenamedTitleEvent
    timelineEdge: IssueTimelineItemEdge
}

input ChangeIssueCategoryInput {
    clientMutationID: String
    issue: ID!
    newCategory: IssueCategory!
}

type ChangeIssueCategoryPayload {
    clientMutationID: String
    issue: Issue
    event: CategoryChangedEvent
    timelineEdge: IssueTimelineItemEdge
}

input AddAssigneeInput {
    clientMutationID: String
    issue: ID!
    userToAssign: ID!
}

type  AddAssigneePayload {
    clientMutationID: String
    issue: Issue
    assignee: User
    event: AssignedEvent
    assigneeEdge: UserEdge
    timelineEdge: IssueTimelineItemEdge
}

input RemoveAssigneeInput {
    clientMutationID: String
    issue: ID!
    userToUnassign: ID!
}

type  RemoveAssigneePayload {
    clientMutationID: String
    issue: Issue
    unassignedUser: User
    event: UnassignedEvent
    timelineEdge: IssueTimelineItemEdge
}

input CloseIssueInput {
    clientMutationID: String
    issueToClose: ID!
}

type CloseIssuePayload {
    clientMutationID: String
    closedIssue: Issue
    event: ClosedEvent
    timelineEdge: IssueTimelineItemEdge
}

input ReopenIssueInput {
    clientMutationID: String
    issueToReopen: ID!
}

type ReopenIssuePayload {
    clientMutationID: ID!
    reopenedIssue: Issue
    event: ReopenedEvent
    timelineEdge: IssueTimelineItemEdge
}

input ChangeIssuePriorityInput {
    clientMutationID: String
    issue: ID!
    newPriority: Priority!
}

type ChangeIssuePriorityPayload {
    clientMutationID: String
    issue: Issue
    event: PriorityChangedEvent
    timelineEdge: IssueTimelineItemEdge
}

input ChangeIssueStartDateInput {
    clientMutationID: String
    issue: ID!
    newStartDate: Date!
}

type ChangeIssueStartDatePayload {
    clientMutationID: String
    issue: Issue
    event: StartDateChangedEvent
    timelineEdge: IssueTimelineItemEdge
}

input ChangeIssueDueDateInput {
    clientMutationID: String
    issue: ID!
    newDueDate: Date!
}

type ChangeIssueDueDatePayload {
    clientMutationID: String
    issue: Issue
    event: DueDateChangedEvent
    timelineEdge: IssueTimelineItemEdge
}

input ChangeIssueEstimatedTimeInput {
    clientMutationID: String
    issue: ID!
    newEstimatedTime: TimeSpan!
}

type ChangeIssueEstimatedTimePayload {
    clientMutationID: String
    issue: Issue
    event: EstimatedTimeChangedEvent
    timelineEdge: IssueTimelineItemEdge
}

input AddIssueToLocationInput {
    clientMutationID: String
    issue: ID!
    locationToAdd: ID!
}

type AddIssueToLocationPayload {
    clientMutationID: String
    issue: Issue
    addedLocation: IssueLocation
    event: AddedToLocationEvent
    locationEdge: IssueLocationEdge
    timelineEdge: IssueTimelineItemEdge
}

input RemoveIssueFromLocationInput {
    clientMutationID: String
    issue: ID!
    locationToRemove: ID!
}

type RemoveIssueFromLocationPayload {
    clientMutationID: String
    issue: Issue
    removedLocation: IssueLocation
    event: RemovedFromLocationEvent
    timelineEdge: IssueTimelineItemEdge
}

input AddIssueToComponentInput {
    clientMutationID: String
    issue: ID!
    componentToAdd: ID!
}

type AddIssueToComponentPayload {
    clientMutationID: String
    issue: Issue
    addedComponent: Component
    event: AddedToComponentEvent
    componentEdge: ComponentEdge
    timelineEdge: IssueTimelineItemEdge
}

input RemoveIssueFromComponentInput {
    clientMutationID: String
    issue: ID!
    componentToRemove: ID!
}

type RemoveIssueFromComponentPayload {
    clientMutationID: String
    issue: Issue
    removedComponent: Component
    event: RemovedFromComponentEvent
    timelineEdge: IssueTimelineItemEdge
}


input MarkIssueAsDuplicateInput {
    clientMutationID: String
    issue: ID!
    originalIssue: ID!
}

type MarkIssueAsDuplicatePayload {
    clientMutationID: String
    issue: Issue
    originalIssue: Issue
    event: MarkedAsDuplicateEvent
    timelineEdge: IssueTimelineItemEdge
}


input UnmarkIssueAsDuplicateInput {
    clientMutationID: String
    issue: ID!
}

type UnmarkIssueAsDuplicatePayload {
    clientMutationID: String
    issue: Issue
    event: MarkedAsDuplicateEvent
    timelineEdge: IssueTimelineItemEdge
}

*/