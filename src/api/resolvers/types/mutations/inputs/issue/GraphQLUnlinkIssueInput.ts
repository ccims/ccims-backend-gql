import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let unlinkIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnlinkIssueInput",
    description: "The inputs for the unlinkIssue",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLUnlinkIssueInput = new GraphQLInputObjectType(unlinkIssueInputConfig);
export default GraphQLUnlinkIssueInput;