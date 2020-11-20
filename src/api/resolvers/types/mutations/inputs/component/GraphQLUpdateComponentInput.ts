import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from "graphql";
import GraphQLIMSType from "../../../../enums/GraphQLIMSType";
import GraphQLJSON from "../../../../scalars/GraphQLJSON";

const updateComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateComponentInput",
    description: "The inputs for the updateComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component to update"
        },
        name: {
            type: GraphQLString,
            description: "The (non unique) display name of this component\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "A textual description (of the fuction) of this component.\n\nMax. 65536 characters. `null` equivalent to \"\""
        },
        imsType: {
            type: GraphQLIMSType,
            description: "The type/system the IMS of this component is an instance of"
        },
        endpoint: {
            type: GraphQLString,
            description: `The endpoint where to reach the IMS of this component instance.

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
            type: GraphQLJSON,
            description: `Data needed for the connection to the IMS API.

See the documentation for the IMS extions for information which keys are expected.
This must be a valid JSON-string`
        }
    })
};
const GraphQLUpdateComponentInput = new GraphQLInputObjectType(updateComponentInputConfig);
export default GraphQLUpdateComponentInput;