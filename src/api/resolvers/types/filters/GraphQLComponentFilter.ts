import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLIMSType from "../../enums/GraphQLIMSType";

export default new GraphQLInputObjectType({
    name: "ComponentFilter",
    description: "Filters for component matching the given properties",
    fields: {
        name: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The name of the component must match any of the given strings"
        },
        owner: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The owner of the project must have any of the given ids"
        },
        description: {
            type: GraphQLString,
            description: "The projects description must match the given __RegEx__"
        },
        imsType: {
            type: GraphQLList(GraphQLNonNull(GraphQLIMSType)),
            description: "The IMS type of a component must be one of the given ones"
        }
    }
});