import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let removeIssueFromComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveIssueFromComponentInput",
    description: "The inputs for the removeIssueFromComponent",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLRemoveIssueFromComponentInput = new GraphQLInputObjectType(removeIssueFromComponentInputConfig);
export default GraphQLRemoveIssueFromComponentInput;