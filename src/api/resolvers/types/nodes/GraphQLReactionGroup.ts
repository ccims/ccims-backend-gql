import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode, { nodeFields } from "../GraphQLNode";
import { ReactionGroup } from "../../../../common/nodes/ReactionGroup";
import { ResolverContext } from "../../../ResolverContext";
import usersListQuery from "../../listQueries/usersListQuery";
import { User } from "../../../../common/nodes/User";

const reactionGroupConfig: GraphQLObjectTypeConfig<ReactionGroup, ResolverContext> = {
    name: "ReactionGroup",
    description: "A relation of users who have reacted with a certain reaction to something",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...nodeFields<ReactionGroup>("ReactionGroup"),
        reaction: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the recation with which the people in this reaction group have reacted"
        },
        users: usersListQuery<ReactionGroup, User>("Users who reacted with this reaction.", reactionGroup => reactionGroup.usersProperty)
    })
}
const GraphQLReactionGroup = new GraphQLObjectType(reactionGroupConfig);
export default GraphQLReactionGroup;