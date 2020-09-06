import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addIssueToComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueToComponentInput",
    description: "The inputs for the addIssueToComponent",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLAddIssueToComponentInput = new GraphQLInputObjectType(addIssueToComponentInputConfig);
export default GraphQLAddIssueToComponentInput;