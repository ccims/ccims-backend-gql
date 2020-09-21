import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInputObjectTypeExtensions, GraphQLInputObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";

const reactionGroupFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ReactionGroupFilter",
    description: "A filter for reaction groups (a reaction together with the users who reacted). All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        reaction: {
            type: GraphQLString,
            description: "The reactions name must match this regex"
        },
        users: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "A list of Users who reacted. Any reaction group which contains at least one of the given users will match the filter"
        }
    })
};
const GraphQLReactionGroupFilter = new GraphQLInputObjectType(reactionGroupFilterConfig);
export default GraphQLReactionGroupFilter;