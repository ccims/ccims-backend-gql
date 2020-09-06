import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeAssigneePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveAssigneePayload",
    description: "The Payload/Response for the removeAssignee mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLRemoveAssigneePayload = new GraphQLObjectType(removeAssigneePayloadConfig);
export default GraphQLRemoveAssigneePayload;