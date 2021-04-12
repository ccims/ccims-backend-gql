import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { Issue } from "../../../../common/nodes/Issue";
import { Label } from "../../../../common/nodes/Label";
import { Project } from "../../../../common/nodes/Project";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import interfacesListQuery from "../../listQueries/interfacesListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import labelsListQuery from "../../listQueries/labelsListQuery";
import GraphQLNode from "../GraphQLNode";
import { namedNodeFields } from "./namedNodeFields";

const projectConfig: GraphQLObjectTypeConfig<Project, ResolverContext> = {
    name: "Project",
    description: "A project is a one unit in which the participating components colaborate",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...namedNodeFields("Project"),
        components: componentsListQuery<Project, Component>("All compomponents which are a part of this project and match (if given) `filterBy`", project => project.componentsProperty),
        interfaces: interfacesListQuery<Project, ComponentInterface>("Requests component interfaces which are offered by any of this project's components", project => project.interfacesProperty),
        issues: issuesListQuery<Project, Issue>("All issues on components that are assigned to this project", project => project.issuesProperty),
        labels: labelsListQuery<Project, Label>("All labels which are available on this project, matching the given filter.\n" +
            "If no filter is given, all labels will be returned", project => project.labelsProperty)
    })
};
const GraphQLProject = new GraphQLObjectType(projectConfig);
export default GraphQLProject;