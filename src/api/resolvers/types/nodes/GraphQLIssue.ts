import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { Issue } from "../../../../common/nodes/Issue";
import { IssueLocation } from "../../../../common/nodes/IssueLocation";
import { Label } from "../../../../common/nodes/Label";
import { ReactionGroup } from "../../../../common/nodes/ReactionGroup";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { IssueTimelineItem } from "../../../../common/nodes/timelineItems/IssueTimelineItem";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import componentsListQuery from "../../listQueries/componentsListQuery";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import labelsListQuery from "../../listQueries/labelsListQuery";
import locationsListQuery from "../../listQueries/locationsListQuery";
import reactionsListQuery from "../../listQueries/reactionsListQuery";
import timelineItemsListQuery from "../../listQueries/timelineListQuery";
import usersListQuery from "../../listQueries/usersListQuery";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLTimeSpan from "../../scalars/GraphQLTimeSpan";
import GraphQLNode from "../GraphQLNode";
import GraphQLComment from "./GraphQLComment";
import GraphQLUser from "./GraphQLUser";

const issueConfig: GraphQLObjectTypeConfig<Issue, ResolverContext> = {
    name: "Issue",
    description: "A cross component issue within ccims which links multiple issues from single ims",
    interfaces: () => ([GraphQLComment, GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this issue"
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
            description: "The title to display for this issue.\n\nNot unique; Max. 256 characters"
        },
        body: {
            type: GraphQLString,
            description: "The body text of the issue.\nMarkdown supported.\n\nMax. 65536 characters"
        },
        bodyRendered: {
            type: GraphQLString,
            description: "The body text of the issue rendered to html"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user who originally created the issue (in ccims or any ims)"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLUser)),
            description: "A list of all people who edited the root of this issue (body and title)"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the issue was first created on"
        },
        lastEditedAt: {
            type: GraphQLDate,
            description: "Date when the core issue(title, body etc.) was last changed (comments and other events DO NOT count)"
        },
        updatedAt: {
            type: GraphQLDate,
            description: "Date when any update / activity was made to any part of the issue (__including__ title, commens, reactions)"
        },
        isOpen: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the issue is open at this point"
        },
        isDuplicate: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "Weather or not this issue has been marked as duplicate of another issue"
        },
        category: {
            type: GraphQLNonNull(GraphQLIssueCategory),
            description: "The ccims-issue-category the issue belongs to.\n\nThis can be one of BUG,FEATURE_REQUEST or UNCLASSIFIED"
        },
        currentUserCanEdit: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to edit this issue.\n\nThis only refers to editing the core issue (title, body, etc.)"
        },
        currentUserCanComment: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to comment on this issue."
        },
        startDate: {
            type: GraphQLDate,
            description: "A start date set for start of work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        dueDate: {
            type: GraphQLDate,
            description: "A due date set when work on the issue must be done.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        estimatedTime: {
            type: GraphQLTimeSpan,
            description: "The time estimated needed for work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        spentTime: {
            type: GraphQLTimeSpan,
            description: "The time already spent on work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        issueComments: issueCommentsListQuery<Issue, IssueComment>("All issue comments on this issue", issue => issue.timelineProperty),
        linksToIssues: issuesListQuery<Issue, Issue>("All issues linked to from issue (this issue is __origin__ of relation, matching the given filter.\n" +
            "If no filter is given, all issues will be returned", issue => issue.linksToIssuesProperty),
        linkedByIssues: issuesListQuery<Issue, Issue>("All issues linking to this issue (this issue is __destination__ of relation), matching the given filter.\n" +
            "If no filter is given, all issues will be returned", issue => issue.linkedByIssuesProperty),
        reactions: reactionsListQuery<Issue, ReactionGroup>("All reactions that have been added to the body of this issue", issue => issue.reactionsProperty),
        assignees: usersListQuery<Issue, User>("All users who are explicitely assigned to issue, matching the given filter.\n" +
            "If no filter is given, all issues will be returned", issue => issue.assigneesProperty),
        labels: labelsListQuery<Issue, Label>("All labels that are currently assigned to this issue", issue => issue.labelsProperty),
        participants: usersListQuery<Issue, User>("All users participating on this issue (by writing a comment, etc.), matching the given filter.\n" +
            "If no filter is given, all users will be returned", issue => issue.participantsProperty),
        pinnedOn: componentsListQuery<Issue, Component>("All components where this issue has been pinned, matching the given filter.\n" +
            "If no filter is given, all components will be returned", issue => issue.pinnedOnProperty),
        timeline: timelineItemsListQuery<Issue, IssueTimelineItem>("All timeline events for this issue in chonological order from oldest to newest, matching (if given) `filterBy`", issue => issue.timelineProperty),
        locations: locationsListQuery<Issue, IssueLocation>("All issue locations this issue is assigned to, matching (if given) `filterBy`", issue => issue.locationsProperty),
        components: componentsListQuery<Issue, Component>("All components this issue is on", issue => issue.componentsProperty)
    })
};
const GraphQLIssue = new GraphQLObjectType(issueConfig);
export default GraphQLIssue;