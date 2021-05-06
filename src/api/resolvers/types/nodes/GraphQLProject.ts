import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { Artifact } from "../../../../common/nodes/Artifact";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { Issue } from "../../../../common/nodes/Issue";
import { Label } from "../../../../common/nodes/Label";
import { Project } from "../../../../common/nodes/Project";
import { ResolverContext } from "../../../ResolverContext";
import artifactsListQuery from "../../listQueries/artifactsListQuery";
import componentInterfacesListQuery from "../../listQueries/componentInterfacesListQuery";
import componentsListQuery from "../../listQueries/componentsListQuery";
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
        components: componentsListQuery<Project, Component>("All Components which are a part of this Project and match (if given) `filterBy`", project => project.componentsProperty),
        interfaces: componentInterfacesListQuery<Project, ComponentInterface>("Requests ComponentInterfaces which are offered by any of this Project's Components", project => project.interfacesProperty),
        issues: issuesListQuery<Project, Issue>("All Issues on Components that are assigned to this Project", project => project.issuesProperty),
        labels: labelsListQuery<Project, Label>("All Labels which are available on this Project, matching the given filter.\n" +
            "If no filter is given, all Labels will be returned", project => project.labelsProperty),
        artifacts: artifactsListQuery<Project, Artifact>("All Artifacts on Components which are part of this Project", project => project.artifactsProperty)
    })
};
const GraphQLProject = new GraphQLObjectType(projectConfig);
export default GraphQLProject;