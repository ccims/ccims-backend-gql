import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const removeIssueFromLocationInputConfig: GraphQLInputObjectTypeConfig = {
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
const GraphQLRemoveIssueFromLocationInput = new GraphQLInputObjectType(removeIssueFromLocationInputConfig);
export default GraphQLRemoveIssueFromLocationInput;