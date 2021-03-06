import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addIssueToComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueToComponentInput",
    description: "The inputs for the addIssueToComponent",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be added to the specified component"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the component the issue should be added to"
        }
    })
};
const GraphQLAddIssueToComponentInput = new GraphQLInputObjectType(addIssueToComponentInputConfig);
export default GraphQLAddIssueToComponentInput;