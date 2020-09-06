import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addIssueToLocationInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueToLocationInput",
    description: "The inputs for the addIssueToLocation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLAddIssueToLocationInput = new GraphQLInputObjectType(addIssueToLocationInputConfig);
export default GraphQLAddIssueToLocationInput;