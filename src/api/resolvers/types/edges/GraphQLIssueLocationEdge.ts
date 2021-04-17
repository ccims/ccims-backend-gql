import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueLocation from "../nodes/GraphQLIssueLocation";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const IssueLocationEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIssueLocation, "IssueLocation");
const GraphQLIssueLocationEdge = new GraphQLObjectType(IssueLocationEdgeConfig);
export default GraphQLIssueLocationEdge;