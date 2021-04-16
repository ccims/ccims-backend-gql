import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const removeLabelFromIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveLabelFromIssueInput",
    description: "The inputs for the removeLabelFromIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue from which to remove a label"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the label to remove from the specified issue"
        }
    })
};
const GraphQLRemoveLabelFromIssueInput = new GraphQLInputObjectType(removeLabelFromIssueInputConfig);
export default GraphQLRemoveLabelFromIssueInput;