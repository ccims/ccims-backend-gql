import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addIssueToLocationInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueToLocationInput",
    description: "The inputs for the addIssueToLocation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be added to the specified issue location"
        },
        location: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue location the issue should be added to"
        }
    })
};
const GraphQLAddIssueToLocationInput = new GraphQLInputObjectType(addIssueToLocationInputConfig);
export default GraphQLAddIssueToLocationInput;