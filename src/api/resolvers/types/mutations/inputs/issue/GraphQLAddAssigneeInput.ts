import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let addAssigneeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddAssigneeInput",
    description: "The inputs for the addAssignee",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to which the new assignee should be added"
        },
        userToAssign: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the user to be added as assignee to the specified issue"
        }
    })
};
let GraphQLAddAssigneeInput = new GraphQLInputObjectType(addAssigneeInputConfig);
export default GraphQLAddAssigneeInput;