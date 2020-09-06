import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addAssigneeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddAssigneeInput",
    description: "The inputs for the addAssignee",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLAddAssigneeInput = new GraphQLInputObjectType(addAssigneeInputConfig);
export default GraphQLAddAssigneeInput;