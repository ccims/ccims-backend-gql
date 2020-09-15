import { GraphQLSchema } from "graphql"
import mutation from "./mutation";
import query from "./query";
import typeImports from "./typeImports";

let ccimsSchema = new GraphQLSchema({
    types: typeImports,
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

type AddIssueCommentPayload {
    comment: IssueComment
    clientMutationID: String
    commentEdge: IssueCommentEdge
    timelineEdge: IssueTimelineItemEdge
}

type  AddAssigneePayload {
    clientMutationID: String
    issue: Issue
    assignee: User
    event: AssignedEvent
    assigneeEdge: UserEdge
    timelineEdge: IssueTimelineItemEdge
}

*/