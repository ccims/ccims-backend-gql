import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let changeIssuePriorityPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssuePriorityPayload",
    description: "The Payload/Response for the changeIssuePriority mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLChangeIssuePriorityPayload = new GraphQLObjectType(changeIssuePriorityPayloadConfig);
export default GraphQLChangeIssuePriorityPayload;