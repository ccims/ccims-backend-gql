import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";

const unpinIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnpinIssueInput",
    description: "The inputs for the unpinIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the issue to unpin"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The component id where to pin the unissue"
        }
    })
};
const GraphQLUnpinIssueInput = new GraphQLInputObjectType(unpinIssueInputConfig);
export default GraphQLUnpinIssueInput;