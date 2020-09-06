import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let markIssueAsDuplicatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "MarkIssueAsDuplicatePayload",
    description: "The Payload/Response for the markIssueAsDuplicate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLMarkIssueAsDuplicatePayload = new GraphQLObjectType(markIssueAsDuplicatePayloadConfig);
export default GraphQLMarkIssueAsDuplicatePayload;