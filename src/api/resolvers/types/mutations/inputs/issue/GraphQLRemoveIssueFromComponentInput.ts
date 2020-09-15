import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let removeIssueFromComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveIssueFromComponentInput",
    description: "The inputs for the removeIssueFromComponent",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to remove from the specified component\n\n(it will be deleted in the components IMS)"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the component from which to remove the issue"
        }
    })
};
let GraphQLRemoveIssueFromComponentInput = new GraphQLInputObjectType(removeIssueFromComponentInputConfig);
export default GraphQLRemoveIssueFromComponentInput;