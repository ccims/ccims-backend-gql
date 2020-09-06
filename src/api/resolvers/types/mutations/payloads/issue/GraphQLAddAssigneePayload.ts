import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addAssigneePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddAssigneePayload",
    description: "The Payload/Response for the addAssignee mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddAssigneePayload = new GraphQLObjectType(addAssigneePayloadConfig);
export default GraphQLAddAssigneePayload;