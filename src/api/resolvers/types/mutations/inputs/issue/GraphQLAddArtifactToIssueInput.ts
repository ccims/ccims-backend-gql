import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addArtifactToIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddArtifactToIssueInput",
    description: "The inputs for the addArtifactToIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to which to add the artifact"
        },
        artifact: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the artifact to be added to the specified issue"
        }
    })
};
const GraphQLAddArtifactToIssueInput = new GraphQLInputObjectType(addArtifactToIssueInputConfig);
export default GraphQLAddArtifactToIssueInput;