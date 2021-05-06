import {  GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { ResolverContext } from "../../../ResolverContext";
import issuesListQuery from "../../listQueries/issuesListQuery";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLIssueLocation, { issueLocationFields } from "./GraphQLIssueLocation";
import labelsListQuery from "../../listQueries/labelsListQuery";
import { Issue } from "../../../../common/nodes/Issue";
import { Project } from "../../../../common/nodes/Project";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { Label } from "../../../../common/nodes/Label";
import imsComponentsListQuery from "../../listQueries/imsComponentsListQuery";
import { IMSComponent } from "../../../../common/nodes/IMSComponent";
import componentInterfacesListQuery from "../../listQueries/componentInterfacesListQuery";
import artifactsListQuery from "../../listQueries/artifactsListQuery";
import { Artifact } from "../../../../common/nodes/Artifact";

const componentConfig: GraphQLObjectTypeConfig<Component, ResolverContext> = {
    name: "Component",
    description: "A component known to ccims.\n\nA component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)",
    interfaces: () => ([GraphQLNode, GraphQLIssueLocation]),
    fields: () => ({
        ...issueLocationFields<Component>("Component"),
        repositoryURL: {
            type: GraphQLString,
            description: "The URL where the code repository of this component is located\n\nMax. 65536 characters"
        },
        issues: issuesListQuery<Component, Issue>("All issues that are mirrored on this component (not the issue location but the ims) matching (if given) `filterBy`", component => component.issuesProperty),
        projects: projectsListQuery<Component, Project>("All projects that this component is assigned to matching the `filterBy`", component => component.projectsProperty),
        interfaces: componentInterfacesListQuery<Component, ComponentInterface>("Requests component interfaces which this component offers", component => component.interfacesProperty),
        consumedInterfaces: componentInterfacesListQuery<Component, ComponentInterface>("Requests component interfaces that are used/consumed by this component", component => component.consumedInterfacesProperty),
        labels: labelsListQuery<Component, Label>("All labels which are available on this component, matching (if given) `filterBy`", component => component.labelsProperty),
        imsComponents: imsComponentsListQuery<Component, IMSComponent>("All IMSComponents which this component is synced to, matching (if given) `filterBy`", component => component.imsComponentsProperty),
        artifacts: artifactsListQuery<Component, Artifact>("All Artifacts on this Component, matching (if given) `filterBy`", component => component.artifactsProperty)
    })
};
const GraphQLComponent = new GraphQLObjectType(componentConfig);
export default GraphQLComponent;