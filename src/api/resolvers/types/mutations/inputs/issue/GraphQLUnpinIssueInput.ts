import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let unpinIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnpinIssueInput",
    description: "The inputs for the unpinIssue",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLUnpinIssueInput = new GraphQLInputObjectType(unpinIssueInputConfig);
export default GraphQLUnpinIssueInput;