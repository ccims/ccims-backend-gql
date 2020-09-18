import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Project } from "../../../../common/nodes/Project";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import labels from "../../listQueries/labels";
import usersListQuery from "../../listQueries/usersListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";
import issuesListQuery from "../../listQueries/issuesListQuery";

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
        components: componentsListQuery("All compomponents which are a part of this project and match (if given) `filterBy`", project => project.componentsProperty),
        users: usersListQuery("All users that participate in this project and (if given)match `filterBy`", project => project.usersProperty),
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user who administrates \"owns\" the project"
        },
        issues: issuesListQuery("All issues on components that are assigned to this project", project => project.issuesProperty),
        labels: labels(),
        description: {
            type: GraphQLString,
            description: "A textual description of this project.\n\nMax. 65536 characters"
        }
    })
};
let GraphQLProject = new GraphQLObjectType(projectConfig);
export default GraphQLProject;