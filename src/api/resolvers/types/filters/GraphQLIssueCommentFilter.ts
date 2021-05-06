import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { commentFilterFields } from "./commentFilterFields";

const issueCommentFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueCommentFilter",
    description: "Filter for comments on issues (not including the issue bodies themselves). All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        ...commentFilterFields<IssueComment>("IssueComment"),
        issue: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the issue the comment belongs to must match any of the given ids"
        }
    })
};
const GraphQLIssueCommentFilter = new GraphQLInputObjectType(issueCommentFilterConfig);
export default GraphQLIssueCommentFilter;