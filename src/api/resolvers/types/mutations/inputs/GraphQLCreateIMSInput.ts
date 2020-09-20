import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID } from "graphql";
import GraphQLJSON from "../../../scalars/GraphQLJSON";
import GraphQLIMSType from "../../../enums/GraphQLIMSType";

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
            description: "The type/system this IMS is an instance of"
        },
        endpoint: {
            type: GraphQLNonNull(GraphQLString),
            description: `The endpoint where to reach the IMS instance.

In the most cases this will be a URL in the form of
\`\`\`
https://example.com/api/[API_KEY]
\`\`\`
where strings in [] can be replaced by the IMS extension with values needed
(either dynamid, like the API key of a user or static, like values from the config).
See the documentation for the IMS extions for information which keys are expected.

In rare cases depending on the IMS type this might be empty or not a URL`
        },
        connectionData: {
            type: GraphQLNonNull(GraphQLJSON),
            description: `Data needed for the connection to the IMS API.

See the documentation for the IMS extions for information which keys are expected.
This must be a valid JSON-string`
        }
    })
};
const GraphQLCreateIMSInput = new GraphQLInputObjectType(createIMSInputConfig);
export default GraphQLCreateIMSInput;