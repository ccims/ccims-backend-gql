import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeLabelFromIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveLabelFromIssuePayload",
    description: "The Payload/Response for the removeFromIssueLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLRemoveLabelFromIssuePayload = new GraphQLObjectType(removeLabelFromIssuePayloadConfig);
export default GraphQLRemoveLabelFromIssuePayload;