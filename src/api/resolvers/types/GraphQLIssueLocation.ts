import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLString } from "graphql";
import GraphQLNode from "./GraphQLNode";
import issuesOnLocation from "../listQueries/issuesOnLocation";

export default new GraphQLInterfaceType({
    name: "IssueLocation",
    description: "A location an issue can be assigned to\n\nCurrently this can be either a component or an interface",
    interfaces: [GraphQLNode],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of the node of this location"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the location\n\nMax. 256 characters"
        },
        issuesOnLocation
    }
});