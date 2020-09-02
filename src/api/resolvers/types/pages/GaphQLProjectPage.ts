import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProjectEdge from "../edges/GraphQLProjectEdge";
import GraphQLProject from "../nodes/GraphQLProject";

export default new GraphQLObjectType({
    name: "ProjectPage",
    description: "A page of projects",
    fields: {
        nodes: {
            type: GraphQLList(GraphQLProject),
            description: "All projects on this page"
        },
        edges: {
            type: GraphQLList(GraphQLProjectEdge),
            description: "Edges to all nodes containing the cursor"
        }
    }
});