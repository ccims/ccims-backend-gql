import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLIssueEdge from "../edges/GraphQLIssueEdge";
import { ResolverContext } from "../../../ResolverContext";

const IssuePageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIssue, () => GraphQLIssueEdge, "Issue");
const GraphQLIssuePage = new GraphQLObjectType(IssuePageConfig);
export default GraphQLIssuePage;