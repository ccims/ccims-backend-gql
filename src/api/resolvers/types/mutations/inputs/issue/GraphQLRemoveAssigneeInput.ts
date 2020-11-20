import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";

const removeAssigneeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveAssigneeInput",
    description: "The inputs for the removeAssignee",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue from which to remove an assignee"
        },
        user: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the user being unassigned from the specified issue"
        }
    })
};
const GraphQLRemoveAssigneeInput = new GraphQLInputObjectType(removeAssigneeInputConfig);
export default GraphQLRemoveAssigneeInput;