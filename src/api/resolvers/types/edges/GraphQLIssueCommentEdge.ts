import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const IssueCommentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueComment, "IssueComment");
const GraphQLIssueCommentEdge = new GraphQLObjectType(IssueCommentEdgeConfig);
export default GraphQLIssueCommentEdge;