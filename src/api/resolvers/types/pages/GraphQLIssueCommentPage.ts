import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";
import GraphQLIssueCommentEdge from "../edges/GraphQLIssueCommentEdge";
import { ResolverContext } from "../../../ResolverContext";

const issueCommentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIssueComment, () => GraphQLIssueCommentEdge, "IssueComment");
const GraphQLIssueCommentPage = new GraphQLObjectType(issueCommentPageConfig);
export default GraphQLIssueCommentPage;