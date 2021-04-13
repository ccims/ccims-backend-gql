import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull } from "graphql";
import GraphQLIMSType from "../../../../enums/GraphQLIMSType";
import GraphQLJSON from "../../../../scalars/GraphQLJSON";

const createIMSInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateIMSInput",
    description: "The inputs for the createIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        imsType: {
            type: GraphQLNonNull(GraphQLIMSType),
            description: "The type/system the IMS of this component is an instance of"
        },
        imsData: {
            type: GraphQLJSON,
            description: `Data needed for the connection to the IMS API.

See the documentation for the IMS extensions for information which keys are expected.
This must be a valid JSON-string`
        }
    })
};
const GraphQLCreateIMSInput = new GraphQLInputObjectType(createIMSInputConfig);
export default GraphQLCreateIMSInput;