import { GraphQLInputObjectType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { issueLocationFilterFields } from "./GraphQLIssueLocationFilter";

const componentInterfaceFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ComponentInterfaceFilter",
    description: "Filters for an instance of a component's interface",
    fields: () => ({
        ...issueLocationFilterFields<ComponentInterface>("ComponentInterface"),
        component: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, only interfaces, that are __offered by__ one of the components with the IDs given can match the given filter"
        },
        consumedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, only interfaces which are consumed by at least one of the components with the given ids can match the filter"
        }
    })
};
const GraphQLComponentInterfaceFilter = new GraphQLInputObjectType(componentInterfaceFilterConfig);
export default GraphQLComponentInterfaceFilter;