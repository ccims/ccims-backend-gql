import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import GraphQLNode from "../GraphQLNode";
import components from "../../listQueries/components";
import users from "../../listQueries/users";
import issues from "../../listQueries/issues";
import GraphQLUser from "./GraphQLUser";

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
            description: "The human readable name of this project"
        },
        components,
        users,
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user which administrates \"owns\" the project"
        },
        issues
    }
});