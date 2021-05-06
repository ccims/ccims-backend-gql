import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const issueTimelineItemEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueTimelineItem, "IssueTimelineItem");
const GraphQLIssueTimelineItemEdge = new GraphQLObjectType(issueTimelineItemEdgeConfig);
export default GraphQLIssueTimelineItemEdge;