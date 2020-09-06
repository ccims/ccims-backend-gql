import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let changeIssueDueDatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueDueDatePayload",
    description: "The Payload/Response for the changeIssueDueDate mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLChangeIssueDueDatePayload = new GraphQLObjectType(changeIssueDueDatePayloadConfig);
export default GraphQLChangeIssueDueDatePayload;