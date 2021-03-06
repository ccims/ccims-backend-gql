import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addAssigneeInputConfig: GraphQLInputObjectTypeConfig = {
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
        user: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the user to be added as assignee to the specified issue"
        }
    })
};
const GraphQLAddAssigneeInput = new GraphQLInputObjectType(addAssigneeInputConfig);
export default GraphQLAddAssigneeInput;