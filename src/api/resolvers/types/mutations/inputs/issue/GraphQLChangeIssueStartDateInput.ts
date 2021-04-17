import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import GraphQLDate from "../../../../scalars/GraphQLDate";

const changeIssueStartDateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueStartDateInput",
    description: "The inputs for the changeIssueStartDate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to change the start date of"
        },
        newStartDate: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The new start date to assign to the issue"
        }
    })
};
const GraphQLChangeIssueStartDateInput = new GraphQLInputObjectType(changeIssueStartDateInputConfig);
export default GraphQLChangeIssueStartDateInput;