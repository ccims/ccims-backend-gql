import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLJSON from "../../../../scalars/GraphQLJSON";

const createIMSComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateIMSInput",
    description: "The inputs for the createIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The component which the IMS is linked to"
        },
        ims: {
            type: GraphQLNonNull(GraphQLID),
            description: "The IMS which is linked to the component"
        },
        imsData: {
            type: GraphQLJSON,
            description: `Data needed for the connection to the IMS API to this specific component.

See the documentation for the IMS extensions for information which keys are expected.
This must be a valid JSON-string`
        }
    })
};
const GraphQLCreateIMSComponentInput = new GraphQLInputObjectType(createIMSComponentInputConfig);
export default GraphQLCreateIMSComponentInput;