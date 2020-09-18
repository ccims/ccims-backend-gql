import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const closeIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CloseIssueInput",
    description: "The inputs for the closeIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be closed"
        }
    })
};
const GraphQLCloseIssueInput = new GraphQLInputObjectType(closeIssueInputConfig);
export default GraphQLCloseIssueInput;