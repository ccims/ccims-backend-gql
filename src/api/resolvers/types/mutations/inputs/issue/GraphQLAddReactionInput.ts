import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addReactionInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddReactionInput",
    description: "The inputs for the addReaction",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLAddReactionInput = new GraphQLInputObjectType(addReactionInputConfig);
export default GraphQLAddReactionInput;