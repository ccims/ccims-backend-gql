import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteIssueInput",
    description: "The inputs for the deleteIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the issue to delete"
        }
    })
};
const GraphQLDeleteIssueInput = new GraphQLInputObjectType(deleteIssueInputConfig);
export default GraphQLDeleteIssueInput;
