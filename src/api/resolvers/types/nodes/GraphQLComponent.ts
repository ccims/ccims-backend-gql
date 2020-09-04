import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";
import GraphQLIMSType from "../../enums/GraphQLIMSType";
import issues from "../../listQueries/issues";
import issuesOnLocation from "../../listQueries/issuesOnLocation";
import projects from "../../listQueries/projects";
import interfaces from "../../listQueries/interfaces";
import consumedInterfaces from "../../listQueries/consumedInterfaces";
import GraphQLIssueLocation from "../GraphQLIssueLocation";
import { Component } from "../../../../common/nodes/Component";
import { ResolverContext } from "../../../ResolverContext";

let componentConfig: GraphQLObjectTypeConfig<Component, ResolverContext> = {
    name: "Component",
    description: "A component known to ccims.\n\nA component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)",
    interfaces: [GraphQLNode, GraphQLIssueLocation],
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
        imsType: {
            type: GraphQLIMSType,
            description: "The software of the IMS used by this component. This must be one of the supported ones"
        },
        issues,
        issuesOnLocation,
        projects,
        interfaces,
        consumedInterfaces
        //TODO: Note: I didn't add the IMS data becaus that might contain sensitive information wich shouldn't be passed to the client
    })
};
let GraphQLComponent = new GraphQLObjectType(componentConfig);
export default GraphQLComponent;