import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const issueCommentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueComment, "IssueComment");
const GraphQLIssueCommentEdge = new GraphQLObjectType(issueCommentEdgeConfig);
export default GraphQLIssueCommentEdge;