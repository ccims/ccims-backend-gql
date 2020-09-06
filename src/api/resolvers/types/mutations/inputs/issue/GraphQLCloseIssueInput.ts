import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let closeIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CloseIssueInput",
    description: "The inputs for the closeIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLCloseIssueInput = new GraphQLInputObjectType(closeIssueInputConfig);
export default GraphQLCloseIssueInput;