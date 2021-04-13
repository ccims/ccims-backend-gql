import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addLabelToIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddLabelToIssueInput",
    description: "The inputs for the addToIssueLabel",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to which to add the label"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the label to be added to the specified issue"
        }
    })
};
const GraphQLAddLabelToIssueInput = new GraphQLInputObjectType(addLabelToIssueInputConfig);
export default GraphQLAddLabelToIssueInput;