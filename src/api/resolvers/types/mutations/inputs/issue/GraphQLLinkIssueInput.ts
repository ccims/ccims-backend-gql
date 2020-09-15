import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";

let linkIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "LinkIssueInput",
    description: "The inputs for the linkIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be linked to another one (the __origin__ of the relation)"
        },
        issueToLink: {
            type: GraphQLNonNull(GraphQLID),
            description: "TheID of the issue to link the above issue to (the __destination__ of the relation)"
        }
    })
};
let GraphQLLinkIssueInput = new GraphQLInputObjectType(linkIssueInputConfig);
export default GraphQLLinkIssueInput;