import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let changeIssueCategoryPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueCategoryPayload",
    description: "The Payload/Response for the changeIssueCategory mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLChangeIssueCategoryPayload = new GraphQLObjectType(changeIssueCategoryPayloadConfig);
export default GraphQLChangeIssueCategoryPayload;