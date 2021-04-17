import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType, GraphQLInt } from "graphql";

const createArtifactInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateArtifactInput",
    description: "The inputs for the createArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        uri: {
            type: GraphQLNonNull(GraphQLString),
            description: "The location of the resource. This should be a valid URL in most cases"
        },
        lineRangeStart: {
            type: GraphQLInt,
            description: "The start of the line range. This can only be applied to text documents. Optional"
        },
        lineRangeEnd: {
            type: GraphQLInt,
            description: "The end of the line range. This can only be applied to text documents. Optional"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component on which the Artifact is created on"
        }
    })
};
const GraphQLCreateArtifactInput = new GraphQLInputObjectType(createArtifactInputConfig);
export default GraphQLCreateArtifactInput;
