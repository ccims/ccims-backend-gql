import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";

let issueLocationFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueLocationFilter",
    description: "Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        name: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The name of the location must match one of the gien strings"
        }
    })
};
let GraphQLIssueLocationFilter = new GraphQLInputObjectType(issueLocationFilterConfig);
export default GraphQLIssueLocationFilter;