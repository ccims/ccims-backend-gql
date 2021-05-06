import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLPriority from "../../../../enums/GraphQLPriority";

const changeIssuePriorityInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssuePriorityInput",
    description: "The inputs for the changeIssuePriority",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to change the priority of"
        },
        newPriority: {
            type: GraphQLNonNull(GraphQLPriority),
            description: "The new priority to be set for the issue"
        }
    })
};
const GraphQLChangeIssuePriorityInput = new GraphQLInputObjectType(changeIssuePriorityInputConfig);
export default GraphQLChangeIssuePriorityInput;