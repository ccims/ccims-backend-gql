import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";
import { ReactionGroup } from "../../../../common/nodes/ReactionGroup";
import { ResolverContext } from "../../../ResolverContext";

let reactionGroupConfig: GraphQLObjectTypeConfig<ReactionGroup, ResolverContext> = {
    name: "ReactionGroup",
    description: "A relation of users who have reacted with a certain reaction to something",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this reaction group"
        },
        users: {
            type: GraphQLList(GraphQLUser),
            description: `Users who reacted with this reaction.\n\n
            If there are only a few, all users will be returned. 
            If too many users are part of this reaction group, only a few will be returned`
        },
        totalUserCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of users in this reaction group.\n\This is needed in case the `users` list was truncated."
        },
        reaction: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the recation with which the people in this reaction group have reacted"
        }
    })
}
let GraphQLReactionGroup = new GraphQLObjectType(reactionGroupConfig);
export default GraphQLReactionGroup;