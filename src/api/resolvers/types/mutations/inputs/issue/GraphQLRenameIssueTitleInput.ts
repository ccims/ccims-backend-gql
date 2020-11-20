import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const renameIssueTitleInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RenameIssueTitleInput",
    description: "The inputs for the renameIssueTitle",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to rename (Change the title of)"
        },
        newTitle: {
            type: GraphQLNonNull(GraphQLString),
            description: "The new title to set for the issue.\n\nMax. 256 characters"
        }
    })
};
const GraphQLRenameIssueTitleInput = new GraphQLInputObjectType(renameIssueTitleInputConfig);
export default GraphQLRenameIssueTitleInput;