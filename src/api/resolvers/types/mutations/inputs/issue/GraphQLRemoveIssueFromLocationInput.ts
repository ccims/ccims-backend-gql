import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let removeIssueFromLocationInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveIssueFromLocationInput",
    description: "The inputs for the removeIssueFromLocation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to remove from the specified location"
        },
        location: {
            type: GraphQLNonNull(GraphQLID),
            description: "The issue-location ID from which to remove the issue"
        }
    })
};
let GraphQLRemoveIssueFromLocationInput = new GraphQLInputObjectType(removeIssueFromLocationInputConfig);
export default GraphQLRemoveIssueFromLocationInput;