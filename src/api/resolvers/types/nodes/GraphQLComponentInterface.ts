import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLComponent from "./GraphQLComponent";
import GraphQLIssueLocation, { issueLocationFields } from "./GraphQLIssueLocation";
import { Component } from "../../../../common/nodes/Component";
const componentInterfaceConfig: GraphQLObjectTypeConfig<ComponentInterface, ResolverContext> = {
    name: "ComponentInterface",
    description: "An interface offered by a component which can be counsumed by other components",
    interfaces: () => ([GraphQLNode, GraphQLIssueLocation]),
    fields: () => ({
        ...issueLocationFields<ComponentInterface>("ComponentInterface"),
        type: {
            type: GraphQLString,
            description: "The type of the ComponentInterface",
            resolve: componentInterface => componentInterface.interfaceType
        },
        component: {
            type: GraphQLComponent,
            description: "The parent component of this interface which offers it, null if deleted"
        },
        consumedBy: componentsListQuery<ComponentInterface, Component>("Components which consume the interface and match the filter.\n\nIf no filter is given, all components will be returned",
            iface => iface.consumedByProperty)
    })
};
const GraphQLComponentInterface = new GraphQLObjectType(componentInterfaceConfig);
export default GraphQLComponentInterface