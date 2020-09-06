import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let changeIssuePriorityInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssuePriorityInput",
    description: "The inputs for the changeIssuePriority",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLChangeIssuePriorityInput = new GraphQLInputObjectType(changeIssuePriorityInputConfig);
export default GraphQLChangeIssuePriorityInput;