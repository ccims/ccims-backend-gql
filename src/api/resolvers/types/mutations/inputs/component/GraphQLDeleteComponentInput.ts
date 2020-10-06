import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteComponentInput",
    description: "The inputs for the deleteComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component to delete"
        }
    })
};
const GraphQLDeleteComponentInput = new GraphQLInputObjectType(deleteComponentInputConfig);
export default GraphQLDeleteComponentInput;
