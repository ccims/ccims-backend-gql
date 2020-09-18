import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLProject from "../nodes/GraphQLProject";

let projectEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ProjectEdge",
    description: "An edge for a ProjectPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLProject,
            description: "The project linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
let GraphQLProjectEdge = new GraphQLObjectType(projectEdgeConfig);
export default GraphQLProjectEdge;