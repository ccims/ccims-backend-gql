import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";

export default new GraphQLInputObjectType({
    name: "IssueLocationFilter",
    description: `Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_`,
    fields: {
        name: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The name of the location must match one of the gien strings"
        }
    }
});