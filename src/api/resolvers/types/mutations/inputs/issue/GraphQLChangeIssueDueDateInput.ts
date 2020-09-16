import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLDate from "../../../../scalars/GraphQLDate";

let changeIssueDueDateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueDueDateInput",
    description: "The inputs for the changeIssueDueDate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue of which to change the due date"
        },
        newDueDate: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The new due date to be set for the issue"
        }
    })
};
let GraphQLChangeIssueDueDateInput = new GraphQLInputObjectType(changeIssueDueDateInputConfig);
export default GraphQLChangeIssueDueDateInput;