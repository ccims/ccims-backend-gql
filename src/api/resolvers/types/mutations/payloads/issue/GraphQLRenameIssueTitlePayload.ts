import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let renameIssueTitlePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RenameIssueTitlePayload",
    description: "The Payload/Response for the renameIssueTitle mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLRenameIssueTitlePayload = new GraphQLObjectType(renameIssueTitlePayloadConfig);
export default GraphQLRenameIssueTitlePayload;