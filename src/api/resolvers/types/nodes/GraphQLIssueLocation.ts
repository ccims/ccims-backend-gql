import { GraphQLID, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import issuesListQuery from "../../listQueries/issuesListQuery";
import GraphQLNode from "../GraphQLNode";
import { IssueLocation } from "../../../../common/nodes/IssueLocation";

let issueLocationConfig: GraphQLInterfaceTypeConfig<IssueLocation, ResolverContext> = {
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
        description: {
            type: GraphQLString,
            description: "A textual description (of the fuction) of this issue location.\n\nMax. 65536 characters"
        },
        issuesOnLocation: issuesListQuery("All issues that are assinged to on this issue location matching (if given) `filterBy`", issueLocation => issueLocation.issuesOnLocationProperty)
    })
};
let GraphQLIssueLocation = new GraphQLInterfaceType(issueLocationConfig);
export default GraphQLIssueLocation;