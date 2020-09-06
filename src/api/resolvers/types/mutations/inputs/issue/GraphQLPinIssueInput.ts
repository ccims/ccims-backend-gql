import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let pinIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "PinIssueInput",
    description: "The inputs for the pinIssue",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLPinIssueInput = new GraphQLInputObjectType(pinIssueInputConfig);
export default GraphQLPinIssueInput;