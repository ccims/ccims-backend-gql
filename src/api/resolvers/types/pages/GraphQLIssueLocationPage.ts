import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIssueLocation from "../nodes/GraphQLIssueLocation";
import GraphQLIssueLocationEdge from "../edges/GraphQLIssueLocationEdge";
import { ResolverContext } from "../../../ResolverContext";

const issueLocationPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIssueLocation, () => GraphQLIssueLocationEdge, "IssueLocation");
const GraphQLIssueLocationPage = new GraphQLObjectType(issueLocationPageConfig);
export default GraphQLIssueLocationPage;