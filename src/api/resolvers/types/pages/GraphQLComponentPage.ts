import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";

export default new GraphQLObjectType({
    name: "ComponentPage",
    description: "A page of multiple components",
    interfaces: [GraphQLPage],
    fields: {
        nodes: {
            type: GraphQLList(GraphQLComponent),
            description: "All components on this page"
        },
        edges: {
            type: GraphQLList(GraphQLComponentEdge),
            description: "Edges to all nodes containing the cursor"
        }
    }
});