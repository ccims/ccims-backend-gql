import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInterfaceTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import issuesOnLocation from "../../listQueries/issuesOnLocation";
import { ResolverContext } from "../../../ResolverContext";

let issueLocationConfig: GraphQLInterfaceTypeConfig<any, ResolverContext> = {
    name: "IssueLocation",
    description: "A location an issue can be assigned to\n\nCurrently this can be either a component or an interface",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of the node of this location"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the location\n\nMax. 256 characters"
        },
        issuesOnLocation: issuesOnLocation()
    })
};
let GraphQLIssueLocation = new GraphQLInterfaceType(issueLocationConfig);
export default GraphQLIssueLocation;