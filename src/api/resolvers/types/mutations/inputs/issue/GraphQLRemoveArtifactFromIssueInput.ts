import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const removeArtifactFromIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveArtifactFromIssueInput",
    description: "The inputs for the removeArtifactFromIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue from which to remove a artifact"
        },
        artifact: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the artifact to remove from the specified issue"
        }
    })
};
const GraphQLRemoveArtifactFromIssueInput = new GraphQLInputObjectType(removeArtifactFromIssueInputConfig);
export default GraphQLRemoveArtifactFromIssueInput;