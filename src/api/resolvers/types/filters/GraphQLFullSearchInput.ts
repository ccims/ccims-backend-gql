import { GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";

const fullSarchConfig: GraphQLInputObjectTypeConfig = {
    name: "FullSearch",
    description: "Filters for issues which have at least one of the specified labels or of which the title or body matches the specified text regex",
    fields: () => ({
        text: {
            type: GraphQLString,
            description: "A Regex which the title or body of the issue needs to match"
        },
        labels: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The issue must have at least one label with one of the given ids"
        }
    })
};
const GraphQLFullSearchInput = new GraphQLInputObjectType(fullSarchConfig);
export default GraphQLFullSearchInput;