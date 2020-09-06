import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let changeIssueDueDateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueDueDateInput",
    description: "The inputs for the changeIssueDueDate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLChangeIssueDueDateInput = new GraphQLInputObjectType(changeIssueDueDateInputConfig);
export default GraphQLChangeIssueDueDateInput;