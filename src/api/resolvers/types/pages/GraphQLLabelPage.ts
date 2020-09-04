import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLLabel from "../nodes/GraphQLLabel";
import GraphQLLabelEdge from "../edges/GraphQLLabelEdge";
import { ResolverContext } from "../../../ResolverContext";

let labelPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "LabelPage",
    description: "A page of multiple labels",
    interfaces: [GraphQLPage],
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLLabel),
            description: "All labels on this page"
        },
        edges: {
            type: GraphQLList(GraphQLLabelEdge),
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
let GraphQLLabelPage = new GraphQLObjectType(labelPageConfig);
export default GraphQLLabelPage;