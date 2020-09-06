import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let removeLabelInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveLabelInput",
    description: "The inputs for the removeLabel",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLRemoveLabelInput = new GraphQLInputObjectType(removeLabelInputConfig);
export default GraphQLRemoveLabelInput;