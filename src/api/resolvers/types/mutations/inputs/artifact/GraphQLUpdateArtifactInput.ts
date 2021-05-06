import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt } from "graphql";

const updateArtifactInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateArtifactInput",
    description: "The inputs for the updateArtifact mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        artifact: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the artifact to update"
        },
        uri: {
            type: GraphQLString,
            description: "The location of the resource. This should be a valid URL in most cases"
        },
        lineRangeStart: {
            type: GraphQLInt,
            description: "The start of the line range. This can only be applied to text documents. If null is provided, the value is unset"
        },
        lineRangeEnd: {
            type: GraphQLInt,
            description: "The end of the line range. This can only be applied to text documents. If null is provided, the value is unset"
        }
    })
};
const GraphQLUpdateArtifactInput = new GraphQLInputObjectType(updateArtifactInputConfig);
export default GraphQLUpdateArtifactInput;