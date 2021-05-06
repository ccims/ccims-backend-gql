import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssue from "../nodes/GraphQLIssue";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const issueEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssue, "Issue");
const GraphQLIssueEdge = new GraphQLObjectType(issueEdgeConfig);
export default GraphQLIssueEdge;