import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";
import GraphQLIssueTimelineItemEdge from "../edges/GraphQLIssueTimelineItemEdge";
import { ResolverContext } from "../../../ResolverContext";

const issueTimelineItemPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIssueTimelineItem, () => GraphQLIssueTimelineItemEdge, "IssueTimelineItem");
const GraphQLIssueTimelineItemPage = new GraphQLObjectType(issueTimelineItemPageConfig);
export default GraphQLIssueTimelineItemPage;