import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComment from "../../../nodes/GraphQLComment";

const updateCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateCommentPayload",
    description: "The Payload/Response for the updateComment mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        comment: {
            type: GraphQLComment,
            description: "The comment object that was updated."
        }
    })
};
const GraphQLUpdateCommentPayload = new GraphQLObjectType(updateCommentPayloadConfig);
export default GraphQLUpdateCommentPayload;