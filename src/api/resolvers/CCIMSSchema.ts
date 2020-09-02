import { GraphQLSchemaConfig, GraphQLSchema, GraphQLFieldConfig } from "graphql"
import mutation from "./mutation";
import query from "./query";

let ccimsSchema = new GraphQLSchema({
    mutation,
    query
});
export default ccimsSchema;

let projects: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLProjectPage,
    description: "Requests projects that match the given filter and are within the specified area.\n\nIf no input is given, all projects will be returned."
};

/*type Query {
        node (
                id: ID!
    ): Node

        projects(
                after: String,
                before: String,
                filterBy: ProjectFilter,
                first: Int,
                last: Int
    ): ProjectPage

}

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

interface Node {
        id: ID!
}

interface Page {
    pageInfo: PageInfo!
    totalCount: Int!
}

type PageInfo {
    startCursor: String
    endCursor: String
    endID: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
}


type User implements Node {
    id: ID!
    username: String!
    displayName: String
    email: String!
    projects(after: String, before: String, filterBy: ProjectFilter, first: Int, last: Int): ProjectPage
    assignedToIssues(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    participantOfIssues(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    issueComments(after: String, before: String, filterBy: IssueCommentFilter, first: Int, last: Int): IssueCommentPage
}

type UserPage implements Page {
    nodes: [User]
    edges: [UserEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type UserEdge {
    node: User
    cursor: String!
}

input UserFilter {
        username: [String!]
        displayName: String
        email: [String!]
        projects: [ID!]
        assignedToIssues: [ID!]
        participantOfIssues: [ID!]
        issueComments: [ID!]
}


type Project implements Node {
    id: ID!
    name: String!
    components(after: String, before: String, filterBy: ComponentFilter, first: Int, last: Int): ComponentPage
    users(after: String, before: String, filterBy: UserFilter, first: Int, last: Int): UserPage
    owner: User!
    issues(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
}

type ProjectPage implements Page {
    nodes: [Project]
    edges: [ProjectEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type ProjectEdge {
    node: Project
    cursor: String!
}

input CreateProjectInput {
        name: String!
        components: [ID!]
        users: [ID!]
        owner: ID!
}

input ProjectFilter {
        name: [String!]
        components: [ID!]
        users: [ID!]
        owner: [ID!]
        issues: [ID!]
}


type Component implements Node & IssueLocation {
    id: ID!
    name: String!
    owner: User
    description: String
    issues(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    issuesOnLocation(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    projects(after: String, before: String, filterBy: ProjectFilter, first: Int, last: Int): ProjectPage
    interfaces(after: String, before: String, filterBy: ComponentInterfaceFilter, first: Int, last: Int): ComponentInterfacePage
    consumedInterfaces(after: String, before: String, filterBy: ComponentInterfaceFilter, first: Int, last: Int): ComponentInterfacePage
    imsType: IMSType!
    imsData: JSON!
}

type ComponentPage implements Page {
    nodes: [Component]
    edges: [ComponentEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type ComponentEdge {
    node: Component
    cursor: String
}

input ComponentFilter {
    name: String
}

type ComponentInterface implements Node & IssueLocation {
    id: ID!
    name: String!
    owner: User!
    description: String
    component: Component!
    issuesOnLocation(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    consumedBy(after: String, before: String, filterBy: ComponentFilter, first: Int, last: Int): ComponentPage
}

type ComponentInterfacePage {
    nodes: [ComponentInterface]
    edges: [ComponentInterfaceEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type ComponentInterfaceEdge {
    node: ComponentInterface
    cursor: String
}

input ComponentInterfaceFilter {
        name: String
        owner: ID
        description: String
        component: ID
        consumedBy: [ID!]
}


type Issue implements Comment & Node {
    id: ID!
    title: String!
    components(after: String, before: String, filterBy: ComponentFilter, first: Int, last: Int): ComponentPage
    body: String
    bodyRendered: String
    createdBy: User
    editedBy: [User]
    createdAt: Date!
        lastEditedAt: Date
        updatedAt: Date
    isOpen: Boolean!
    isDuplicate: Boolean!
    category: IssueCategory!
    issueComments(after: String, before: String, filterBy: IssueCommentFilter, first: Int, last: Int): IssueCommentPage
    linkedIssues(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
    reactions(after: String, before: String, filterBy: ReactionGroupFilter, first: Int, last: Int): ReactionGroupPage
    assignees(after: String, before: String, filterBy: UserFilter, first: Int, last: Int): UserPage
    labels(after: String, before: String, filterBy: LabelFilter, first: Int, last: Int): LabelPage
    participants(after: String, before: String, filterBy: UserFilter, first: Int, last: Int): UserPage
    pinnedOn(after: String, before: String, filterBy: ComponentFilter, first: Int, last: Int): ComponentPage
    timeline(after: String, before: String, filterBy: IssueTimelineItemFilter, first: Int, last: Int): IssueTimelineItemPage
    locations(after: String, before: String, filterBy: IssueLocationFilter, first: Int, last: Int): IssueLocationPage
    currentUserCanEdit: Boolean!
    currentUserCanComment: Boolean!
    startDate: Date
    dueDate: Date
    estimatedTime: TimeSpan
    spentTime: TimeSpan
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

type IssuePage implements Page {
    nodes: [Issue]
    edges: [IssueEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type IssueEdge {
    node: Issue
    cursor: String
}

input IssueFilter {
        title: [String!]
        components: [ID!]
        body: String
        createdBy: [ID!]
        editedBy: [ID!]
        createdAfter: Date
        createdBefore: Date
        editedAfter: Date
        editedBefore: Date
        updatedAfter: Date
        updatedBefore: Date
        isOpen: Boolean
        isDuplicate: Boolean
        category: [IssueCategory!]
        linksIssues: Boolean
        linkedIssues: [ID!]
        reactions: [[String!]!]
        assignees: [ID!]
        labels: [LabelFilter!]
        participants: [ID!]
        locations: [ID!]
        currentUserCanEdit: Boolean
        currentUserCanComment: Boolean
        startDateAfter: Date
        startDateBefore: Date
        dueDateAfter: Date
        dueDateBefore: Date
        estimatedTimeGreaterThan: TimeSpan
        estimatedTimeLowerThan: TimeSpan
        spentTimeGreaterThan: TimeSpan
        spentTimeLowerThan: TimeSpan
}



interface IssueTimelineItem implements Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
}

type IssueTimelineItemPage implements Page {
    nodes: [IssueTimelineItem]
    edges: [IssueTimelineItemEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type IssueTimelineItemEdge {
    node: IssueTimelineItem
    cursor: String
}

input IssueTimelineItemFilter {
        createdBy: [ID!]
        createdAfter: Date
        createdBefore: Date
}

interface Comment {
    id: ID!
    createdBy: User
    editedBy: [User]
    createdAt: Date!
    lastEditedAt: Date
    body: String
    bodyRendered: String
    reactions(after: String, before: String, filterBy: ReactionGroupFilter, first: Int, last: Int): ReactionGroupPage
    currentUserCanEdit: Boolean!
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

type IssueComment implements IssueTimelineItem & Comment & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    editedBy: [User]
    lastEditedAt: Date
    createdAt: Date!
    editedAt: Date
    body: String
    bodyRendered: String
    reactions(after: String, before: String, filterBy: ReactionGroupFilter, first: Int, last: Int): ReactionGroupPage
    currentUserCanEdit: Boolean!
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

type IssueCommentPage implements Page {
    nodes: [IssueComment]
    edges: [IssueCommentEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type IssueCommentEdge {
    node: IssueComment
    cursor: String
}

input IssueCommentFilter {
        issue: [ID!]
        createdBy: [ID!]
        editedBy: [ID!]
        createdAfter: Date
        createdBefore: Date
        editedAfter: Date
        editedBefore: Date
        body: String
        reactions: [[String!]!]
        currentUserCanEdit: Boolean
}

type DeletedIssueComment implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    deletedBy: User
    deletedAt: Date
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

type ReferencedByOtherEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    component: Component
    source: String
    sourceURL: String
}

type ReferencedByIssueEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    mentionedAt: Issue
    mentionedInComment: IssueComment
}

type LinkEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    linkedIssue: Issue
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

type UnlinkEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    removedLinkedIssue: Issue
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

type WasLinkedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    linkedBy: Issue
}

type WasUnlinkedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    unlinkedBy: Issue
}

type LabelledEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    label: Label!
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

type UnlabelledEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    removedLabel: Label!
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

type PinnedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
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

type UnpinnedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
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

type RenamedTitleEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldTitle: String!
    newTitle: String!
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

type CategoryChangedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldCategory: IssueCategory!
    newCategory: IssueCategory!
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

type AssignedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    assignee: User!
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

type UnassignedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    removedAssignee: User!
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

type ClosedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
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

type ReopenedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
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

type PriorityChangedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldPriority: Priority
    newPriority: Priority
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

type StartDateChangedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldStartDate: Date
    newStartDate: Date
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

type DueDateChangedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldDueDate: Date
    newDueDate: Date
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

type EstimatedTimeChangedEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    oldEstimatedTime: TimeSpan
    newEstimatedTime: TimeSpan
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

type AddedToLocationEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    location: IssueLocation!
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

type RemovedFromLocationEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    removedLocation: IssueLocation!
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

type AddedToComponentEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    component: Component!
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

type RemovedFromComponentEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    removedComponent: Component!
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

type MarkedAsDuplicateEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
    originalIssue: Issue
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

type UnmarkedAsDuplicateEvent implements IssueTimelineItem & Node {
    id: ID!
    issue: Issue!
    createdBy: User
    createdAt: Date!
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


type ReactionGroup implements Node {
    id: ID!
    users: [User]
    reaction: String!
}

type ReactionGroupPage {
    nodes: [ReactionGroup]
    edges: [ReactionGroupEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type ReactionGroupEdge {
    node: ReactionGroup
    cursor: String
}

input ReactionGroupFilter {
        reaction: [String!]
        users: [ID!]
}

type Label implements Node {
    id: ID!
    name: String!
    description: String
    colour: Colour
}

type LabelPage {
    nodes: [Label]
    edges: [LabelEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type LabelEdge {
    node: Label
    cursor: String
}

input LabelFilter {
        name: [String!]
        description: String

        colour: [Colour!]
}


enum IMSType {
        CCIMS
        GITHUB
}

enum Priority {

        LOW,
        MEDIUM,
        HIGH
}

enum IssueCategory {

        BUG,

        FEATURE_REQUEST,

        UNCLASSIFIED
}

enum IssueTimelineItemType {
        ISSUE_COMMENT,

        DELETED_ISSUE_COMMENT,

        REFERENCED_BY_OTHER_EVENT,

        REFERENCED_BY_ISSUE_EVENT,

        LINK_EVENT,

        UNLINK_EVENT,

        WAS_LINKED_EVENT,

        WAS_UNLINKED_EVENT,


        LABELLED_EVENT,

        UNLABELLED_EVENT,

        PINNED_EVENT,

        UNPINNED_EVENT,

        RENAMED_TITLE_EVENT,

        CATEGORY_CHANGED_EVENT,

        ASSIGNED_EVENT,

        UNASSIGNED_EVENT,

        CLOSED_EVENT,

        REOPENED_EVENT,

        PRIORITY_CHANGED_EVENT,

        START_DATE_CHANGED_EVENT,

        DUE_DATE_CHANGED_EVENT,

        ESTIMATED_TIME_CHANGED_EVENT,

        ADDED_LOCATION_EVENT,

        REMOVED_LOCATION_EVENT,

        MARKED_AS_DUPLICATE_EVENT,

        UNMARKED_AS_DUPLICATE_EVENT,
}

scalar Date

scalar TimeSpan

scalar Colour

scalar JSON

interface IssueLocation implements Node {
    id: ID!
    issuesOnLocation(after: String, before: String, filterBy: IssueFilter, first: Int, last: Int): IssuePage
}

type IssueLocationPage {
    nodes: [IssueLocation]
    edges: [IssueLocationEdge]
    pageInfo: PageInfo!
    totalCount: Int!
}

type IssueLocationEdge {
    node: IssueLocation
    cursor: String
}

input IssueLocationFilter {
    name: String
}*/