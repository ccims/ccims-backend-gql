import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLIMS from "../nodes/GraphQLIMS";
import GraphQLIMSEdge from "../edges/GraphQLIMSEdge";
import { ResolverContext } from "../../../ResolverContext";

const imsPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMSPage",
    description: "A page of multiple IMS",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLIMS),
            description: "All IMS on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIMSEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
const GraphQLIMSPage = new GraphQLObjectType(imsPageConfig);
export default GraphQLIMSPage;