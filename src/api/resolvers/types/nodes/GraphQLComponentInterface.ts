import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLIssueLocation from "./GraphQLIssueLocation";
import GraphQLUser from "./GraphQLUser";
import GraphQLComponent from "./GraphQLComponent";
import issuesOnLocation from "../../listQueries/issuesOnLocation";
import consumedBy from "../../listQueries/consumedBy";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
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
        consumedBy: consumedBy()
    })
};
let GraphQLComponentInterface = new GraphQLObjectType(componentInterfaceConfig);
export default GraphQLComponentInterface