import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { IssueLocation } from "../../../../common/nodes/IssueLocation";
import { ResolverContext } from "../../../ResolverContext";
import interfacesListQuery from "../../listQueries/interfacesListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLIMS from "./GraphQLIMS";
import GraphQLIssueLocation from "./GraphQLIssueLocation";
import GraphQLUser from "./GraphQLUser";
import labelsListQuery from "../../listQueries/labelsListQuery";
import { Issue } from "../../../../common/nodes/Issue";
import { Project } from "../../../../common/nodes/Project";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { Label } from "../../../../common/nodes/Label";

const componentConfig: GraphQLObjectTypeConfig<Component, ResolverContext> = {
    name: "Component",
    description: "A component known to ccims.\n\nA component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)",
    interfaces: () => ([GraphQLNode, GraphQLIssueLocation]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this component"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The (non unique) display name of this component\n\nMax. 256 characters"
        },
        owner: {
            type: GraphQLUser,
            description: "The user who administrates \"owns\" the component"
        },
        description: {
            type: GraphQLString,
            description: "A textual description (of the fuction) of this component.\n\nMax. 65536 characters"
        },
        ims: {
            type: GraphQLIMS,
            description: "The IMS instance used by this component."
        },
        issues: issuesListQuery<Component, Issue>("All issues that are mirrored on this component (not the issue location but the ims) matching (if given) `filterBy`", component => component.issuesProperty),
        issuesOnLocation: issuesListQuery<IssueLocation, Issue>("All issues that are assigned to this components issue location matching (if given) `filterBy`", component => component.issuesOnLocationProperty),
        projects: projectsListQuery<Component, Project>("All projects that this component is assigned to matching the `filterBy`", component => component.projectsProperty),
        interfaces: interfacesListQuery<Component, ComponentInterface>("Requests component interfaces which this component offers", component => component.interfacesProperty),
        consumedInterfaces: interfacesListQuery<Component, ComponentInterface>("Requests component interfaces that are used/consumed by this component", component => component.consumedInterfacesProperty),
        labels: labelsListQuery<Component, Label>("All labels which are available on this component, matching (if given) `filterBy`", component => component.labelsProperty),
    })
};
const GraphQLComponent = new GraphQLObjectType(componentConfig);
export default GraphQLComponent;