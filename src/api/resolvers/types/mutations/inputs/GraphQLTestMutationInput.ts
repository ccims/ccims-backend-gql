import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

const testMutationInputConfig: GraphQLInputObjectTypeConfig = {
    name: "TestMutationInput",
    description: "The inputs for the testMutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
const GraphQLTestMutationInput = new GraphQLInputObjectType(testMutationInputConfig);
export default GraphQLTestMutationInput;