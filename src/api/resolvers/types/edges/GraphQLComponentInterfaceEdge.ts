import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";

export default new GraphQLObjectType({
    name: "ComponentInterfaceEdge",
    description: "An edge for a ComponentInterfacePage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLComponentInterface,
            description: "The interface linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});