import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { Issue } from "../../../../common/nodes/Issue";
import { Label } from "../../../../common/nodes/Label";
import { Project } from "../../../../common/nodes/Project";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import labelsListQuery from "../../listQueries/labelsListQuery";
import usersListQuery from "../../listQueries/usersListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";

const projectConfig: GraphQLObjectTypeConfig<Project, ResolverContext> = {
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
        components: componentsListQuery<Project, Component>("All compomponents which are a part of this project and match (if given) `filterBy`", project => project.componentsProperty),
        users: usersListQuery<Project, User>("All users that participate in this project and (if given)match `filterBy`", project => project.usersProperty),
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user who administrates \"owns\" the project"
        },
        issues: issuesListQuery<Project, Issue>("All issues on components that are assigned to this project", project => project.issuesProperty),
        labels: labelsListQuery<Project, Label>("All labels which are available on this project, matching the given filter.\n" +
            "If no filter is given, all labels will be returned", project => project.labelsProperty),
        description: {
            type: GraphQLString,
            description: "A textual description of this project.\n\nMax. 65536 characters"
        }
    })
};
const GraphQLProject = new GraphQLObjectType(projectConfig);
export default GraphQLProject;