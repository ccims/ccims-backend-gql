import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueLocation from "../nodes/GraphQLIssueLocation";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const issueLocationEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueLocation, "IssueLocation");
const GraphQLIssueLocationEdge = new GraphQLObjectType(issueLocationEdgeConfig);
export default GraphQLIssueLocationEdge;