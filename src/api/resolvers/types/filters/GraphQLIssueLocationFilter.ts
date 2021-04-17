import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig, GraphQLID } from "graphql";

const issueLocationFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueLocationFilter",
    description: "Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        name: {
            type: GraphQLString,
            description: "The name of the location must match the given RegEx"
        },
        description: {
            type: GraphQLString,
            description: "The issue locations description must match the given __RegEx__"
        },
    })
};
const GraphQLIssueLocationFilter = new GraphQLInputObjectType(issueLocationFilterConfig);
export default GraphQLIssueLocationFilter;