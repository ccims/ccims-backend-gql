import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let unmarkIssueAsDuplicatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnmarkIssueAsDuplicatePayload",
    description: "The Payload/Response for the unmarkIssueAsDuplicate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLUnmarkIssueAsDuplicatePayload = new GraphQLObjectType(unmarkIssueAsDuplicatePayloadConfig);
export default GraphQLUnmarkIssueAsDuplicatePayload;