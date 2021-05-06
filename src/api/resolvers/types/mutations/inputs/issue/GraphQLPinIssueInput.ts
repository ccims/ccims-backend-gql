import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const pinIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "PinIssueInput",
    description: "The inputs for the pinIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the issue to pin"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The component id where to pin the issue"
        }
    })
};
const GraphQLPinIssueInput = new GraphQLInputObjectType(pinIssueInputConfig);
export default GraphQLPinIssueInput;