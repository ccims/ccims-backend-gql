import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { Issue } from "../../../../common/nodes/Issue";
import { Label } from "../../../../common/nodes/Label";
import { Project } from "../../../../common/nodes/Project";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import interfacesListQuery from "../../listQueries/interfacesListQuery";
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
        interfaces: interfacesListQuery<Project, ComponentInterface>("Requests component interfaces which are offered by any of this project's components", project => project.interfacesProperty),
        owner: {
            type: GraphQLUser,
            description: "The user who administrates \"owns\" the project, null if deleted"
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