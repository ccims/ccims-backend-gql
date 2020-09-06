import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let renameIssueTitleInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RenameIssueTitleInput",
    description: "The inputs for the renameIssueTitle",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLRenameIssueTitleInput = new GraphQLInputObjectType(renameIssueTitleInputConfig);
export default GraphQLRenameIssueTitleInput;