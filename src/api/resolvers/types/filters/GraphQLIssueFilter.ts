import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLTimeSpan from "../../scalars/GraphQLTimeSpan";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLLabelFilter from "./GraphQLLabelFilter";

const issueFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueFilter",
    description: "Filters for Issues. All parameters given in this filter will be connected via _AND_\n\n" +
        "Not specific issues in issue management systems but the issue in the ccims",
    fields: () => ({
        title: {
            type: GraphQLString,
            description: "The title of the issue must match the given regex"
        },
        components: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must be on at least one of the components with the given ids"
        },
        body: {
            type: GraphQLString,
            description: "The body text of this issue must match this given __RegEx__"
        },
        createdBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the user creating the issue must be any of the given ones"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the user last editing the issue must match any of the ones in the list"
        },
        createdAfter: {
            type: GraphQLDate,
            description: "The issue must have been created __after__ the given date (inclusive)"
        },
        createdBefore: {
            type: GraphQLDate,
            description: "The issue must have been created __before__ the given date (inclusive)"
        },
        editedAfter: {
            type: GraphQLDate,
            description: "The issue must have been last edited __after__ the given date (inclusive)"
        },
        editedBefore: {
            type: GraphQLDate,
            description: "The issue must have been last edited __before__ the given date (inclusive)"
        },
        updatedAfter: {
            type: GraphQLDate,
            description: "The last event in this issue must have occurred __after__ the given date (inclusive)"
        },
        updatedBefore: {
            type: GraphQLDate,
            description: "The last event in this issue must have occurred __before__ the given date (inclusive)"
        },
        isOpen: {
            type: GraphQLBoolean,
            description: "If given, filters for opened/closed issues"
        },
        isDuplicate: {
            type: GraphQLBoolean,
            description: "If given, filters for issues which are/aren't duplicates of another issue"
        },
        category: {
            type: GraphQLList(GraphQLNonNull(GraphQLIssueCategory)),
            description: "The issue must have any of the given categories to match the filter"
        },
        linksIssues: {
            type: GraphQLBoolean,
            description: "If given, filters for issues which do/don't link __to__ other issues"
        },
        isLinkedByIssues: {
            type: GraphQLBoolean,
            description: "If given, filters for issues which are/aren't linkt __by__ other issues"
        },
        linkedIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must link __to__ at least one of the issues with the given ids"
        },
        linkedByIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must be linked __by__ at least one of the issues with the given ids"
        },
        reactions: {
            type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))),
            description: "The issue (body text) must have all the reactions in one of the lists given."
        },
        assignees: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "Any of the users with the given ids must be an assignee to the issue for it to match this filter"
        },
        labels: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must have at least one label with one of the given ids"
        },
        participants: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "Any of the users with the given ids must be a participant to the issue for it to match this filter"
        },
        locations: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must be assigned to at least one of the locations with the given ids"
        },
        currentUserCanEdit: {
            type: GraphQLBoolean,
            description: "If given filters for issues the current user is allowed/not allowed to edit (the title and body text)"
        },
        currentUserCanComment: {
            type: GraphQLBoolean,
            description: "If given filters for issues the current user is allowed/not allowed to write new comments on"
        },
        startDateAfter: {
            type: GraphQLDate,
            description: "Filters for all issues that have a start date __after__ the give date"
        },
        startDateBefore: {
            type: GraphQLDate,
            description: "Filters for all issues that have a start date __before__ the give date"
        },
        dueDateAfter: {
            type: GraphQLDate,
            description: "Filters for all issues that have a due date __after__ the give date"
        },
        dueDateBefore: {
            type: GraphQLDate,
            description: "Filters for all issues that have a due date __before__ the give date"
        },
        estimatedTimeGreaterThan: {
            type: GraphQLTimeSpan,
            description: "Matches all issues that have an estimated time __greater or equal__ than the given one"
        },
        estimatedTimeLowerThan: {
            type: GraphQLTimeSpan,
            description: "Matches all issues that have an estimated time __lower or equal__ than the given one"
        },
        spentTimeGreaterThan: {
            type: GraphQLTimeSpan,
            description: "Matches all issues that have an actual spent time __greater or equal__ than the given one"
        },
        spentTimeLowerThan: {
            type: GraphQLTimeSpan,
            description: "Matches all issues that have an actual spent time __lower or equal__ than the given one"
        }
    })
};
const GraphQLIssueFilter = new GraphQLInputObjectType(issueFilterConfig);
export default GraphQLIssueFilter;