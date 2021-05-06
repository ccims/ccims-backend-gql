import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIMSUser from "../../../nodes/GraphQLIMSUser";

const linkUserToIMSPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "LinkUserToIMSPayload",
    description: "The Payload/Response for the linkUserToIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        imsUser: {
            type: GraphQLIMSUser,
            description: "The newly created or updated IMSUser that represents the user on the specified IMS"
        }
    })
};
const GraphQLLinkUserToIMSPayload = new GraphQLObjectType(linkUserToIMSPayloadConfig);
export default GraphQLLinkUserToIMSPayload;