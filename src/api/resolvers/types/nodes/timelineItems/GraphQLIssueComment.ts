import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { IssueComment } from "../../../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLComment, { commentFields } from "../GraphQLComment";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const issueCommentConfig: GraphQLObjectTypeConfig<IssueComment, ResolverContext> = {
    name: "IssueComment",
    description: "A commemt on an issue. Not including th issue body itself",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLComment, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<IssueComment>("IssueComment"),
        ...commentFields<IssueComment>("IssueComment")
    })
};
const GraphQLIssueComment = new GraphQLObjectType(issueCommentConfig);
export default GraphQLIssueComment;