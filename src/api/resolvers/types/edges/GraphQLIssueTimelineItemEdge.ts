import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const IssueTimelineItemEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueTimelineItem, "IssueTimelineItem");
const GraphQLIssueTimelineItemEdge = new GraphQLObjectType(IssueTimelineItemEdgeConfig);
export default GraphQLIssueTimelineItemEdge;