import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let removeAssigneeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveAssigneeInput",
    description: "The inputs for the removeAssignee",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLRemoveAssigneeInput = new GraphQLInputObjectType(removeAssigneeInputConfig);
export default GraphQLRemoveAssigneeInput;