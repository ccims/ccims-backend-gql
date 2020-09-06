import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let changeIssueCategoryInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueCategoryInput",
    description: "The inputs for the changeIssueCategory",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLChangeIssueCategoryInput = new GraphQLInputObjectType(changeIssueCategoryInputConfig);
export default GraphQLChangeIssueCategoryInput;