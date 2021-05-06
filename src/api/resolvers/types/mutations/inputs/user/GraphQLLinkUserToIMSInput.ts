import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";
import GraphQLJSON from "../../../../scalars/GraphQLJSON";

const linkUserToIMSInputConfig: GraphQLInputObjectTypeConfig = {
    name: "LinkUserToIMSInputConfig",
    description: "The inputs for the linkUserToIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        user: {
            type: GraphQLString,
            description: "The id of the user which should be linked to the specified IMS"
        },
        ims: {
            type: GraphQLString,
            description: "The id of the IMS which the user is linked to"
        },
        imsData: {
            type: GraphQLJSON,
            description: "Any other data that is necessary to link the user to the IMS, for example a username, id, authorization token etc., this depends on the type of IMS"
        }
    })
};
const GraphQLLinkUserToIMSInput = new GraphQLInputObjectType(linkUserToIMSInputConfig);
export default GraphQLLinkUserToIMSInput;