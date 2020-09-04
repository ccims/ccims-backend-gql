import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import GraphQLNode from "../GraphQLNode";
import components from "../../listQueries/components";
import users from "../../listQueries/users";
import issues from "../../listQueries/issues";
import GraphQLUser from "./GraphQLUser";
import labels from "../../listQueries/labels";

export default new GraphQLObjectType({
    name: "Project",
    description: "A project is a one unit in which the participating components colaborate",
    interfaces: [GraphQLNode],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this project"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The human readable name of this project\n\nMax. 256 characters"
        },
        components,
        users,
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user who administrates \"owns\" the project"
        },
        issues,
        labels
    }
});