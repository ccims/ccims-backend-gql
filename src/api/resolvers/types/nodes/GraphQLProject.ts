import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import components from "../../listQueries/components";
import users from "../../listQueries/users";
import issues from "../../listQueries/issues";
import GraphQLUser from "./GraphQLUser";
import labels from "../../listQueries/labels";
import { Project } from "../../../../common/nodes/Project";
import { ResolverContext } from "../../../ResolverContext";

let projectConfig: GraphQLObjectTypeConfig<Project, ResolverContext> = {
    name: "Project",
    description: "A project is a one unit in which the participating components colaborate",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this project"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The human readable name of this project\n\nMax. 256 characters"
        },
        components: components(),
        users: users(),
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user who administrates \"owns\" the project"
        },
        issues: issues(),
        labels: labels()
    })
};
let GraphQLProject = new GraphQLObjectType(projectConfig);
export default GraphQLProject;