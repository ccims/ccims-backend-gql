import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let linkIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "LinkIssueInput",
    description: "The inputs for the linkIssue",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLLinkIssueInput = new GraphQLInputObjectType(linkIssueInputConfig);
export default GraphQLLinkIssueInput;