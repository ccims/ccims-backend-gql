import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let unlinkIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnlinkIssueInput",
    description: "The inputs for the unlinkIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue which is the __origin__ of the relation"
        },
        issueToUnlink: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue the link to which sholud be removed (destination of relation)"
        }
    })
};
let GraphQLUnlinkIssueInput = new GraphQLInputObjectType(unlinkIssueInputConfig);
export default GraphQLUnlinkIssueInput;