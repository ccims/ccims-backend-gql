import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { ResolverContext } from "../../../ResolverContext";
import interfacesListQuery from "../../listQueries/interfacesListQuery";
import issues from "../../listQueries/issues";
import issuesOnLocation from "../../listQueries/issuesOnLocation";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLIMS from "./GraphQLIMS";
import GraphQLIssueLocation from "./GraphQLIssueLocation";
import GraphQLUser from "./GraphQLUser";

let componentConfig: GraphQLObjectTypeConfig<Component, ResolverContext> = {
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
        issues: issues(),
        issuesOnLocation: issuesOnLocation(),
        projects: projectsListQuery("All projects that this component is assigned to matching the `filterBy`", component => component.projectsProperty),
        interfaces: interfacesListQuery("Requests component interfaces which this component offers", component => component.interfacesProperty),
        consumedInterfaces: interfacesListQuery("Requests component interfaces that are used/consumed by this component", component => component.consumedInterfacesProperty)
    })
};
let GraphQLComponent = new GraphQLObjectType(componentConfig);
export default GraphQLComponent;