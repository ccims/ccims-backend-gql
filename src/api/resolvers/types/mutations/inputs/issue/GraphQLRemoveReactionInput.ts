import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let removeReactionInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveReactionInput",
    description: "The inputs for the removeReaction",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLRemoveReactionInput = new GraphQLInputObjectType(removeReactionInputConfig);
export default GraphQLRemoveReactionInput;