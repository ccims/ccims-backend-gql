import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import issuesOnLocation from "../../listQueries/issuesOnLocation";
import GraphQLNode from "../GraphQLNode";
import GraphQLComponent from "./GraphQLComponent";
import GraphQLIssueLocation from "./GraphQLIssueLocation";
let componentInterfaceConfig: GraphQLObjectTypeConfig<ComponentInterface, ResolverContext> = {
    name: "ComponentInterface",
    description: "An interface offered by a component which can be counsumed by other components",
    interfaces: () => ([GraphQLNode, GraphQLIssueLocation]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this component interface"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the component interface\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "A textual description (of the fuction) of this component interface .\n\nMax. 65536 characters"
        },
        component: {
            type: GraphQLNonNull(GraphQLComponent),
            description: "The parent component of this interface which offers it"
        },
        issuesOnLocation: issuesOnLocation(),
        consumedBy: componentsListQuery("Components which consume the interface and match the filter.\n\nIf no filter is given, all components will be returned",
            iface => iface.consumedByProperty)
    })
};
let GraphQLComponentInterface = new GraphQLObjectType(componentInterfaceConfig);
export default GraphQLComponentInterface