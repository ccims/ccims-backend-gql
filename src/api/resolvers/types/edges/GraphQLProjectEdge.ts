import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProject from "../nodes/GraphQLProject";
import { ResolverContext } from "../../../ResolverContext";

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