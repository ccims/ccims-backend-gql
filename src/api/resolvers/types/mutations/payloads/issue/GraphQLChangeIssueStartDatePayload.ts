import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let changeIssueStartDatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueStartDatePayload",
    description: "The Payload/Response for the changeIssueStartDate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLChangeIssueStartDatePayload = new GraphQLObjectType(changeIssueStartDatePayloadConfig);
export default GraphQLChangeIssueStartDatePayload;