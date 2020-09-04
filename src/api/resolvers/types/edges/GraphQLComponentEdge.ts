import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLComponent from "../nodes/GraphQLComponent";

export default new GraphQLObjectType({
    name: "ComponentEdge",
    description: "An edge for a ComponentPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLComponent,
            description: "The component linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});