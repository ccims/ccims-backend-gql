import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let removeIssueFromLocationInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveIssueFromLocationInput",
    description: "The inputs for the removeIssueFromLocation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLRemoveIssueFromLocationInput = new GraphQLInputObjectType(removeIssueFromLocationInputConfig);
export default GraphQLRemoveIssueFromLocationInput;