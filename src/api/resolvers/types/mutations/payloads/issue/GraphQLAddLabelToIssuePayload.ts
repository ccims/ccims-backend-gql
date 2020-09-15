import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addLabelToIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddLabelToIssuePayload",
    description: "The Payload/Response for the addToIssueLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddLabelToIssuePayload = new GraphQLObjectType(addLabelToIssuePayloadConfig);
export default GraphQLAddLabelToIssuePayload;