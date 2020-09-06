import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addLabelInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddLabelInput",
    description: "The inputs for the addLabel",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLAddLabelInput = new GraphQLInputObjectType(addLabelInputConfig);
export default GraphQLAddLabelInput;