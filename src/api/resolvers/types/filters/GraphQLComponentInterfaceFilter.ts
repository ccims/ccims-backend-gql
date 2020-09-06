import { GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";

let componentInterfaceFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ComponentInterfaceFilter",
    description: "Filters for an instance of a component's interface",
    fields: () => ({
        name: {
            type: GraphQLString,
            description: "The name the component has to have"
        },
        owner: {
            type: GraphQLID,
            description: "Filter for interfacs owned by the user with this id"
        },
        description: {
            type: GraphQLString,
            description: "A Regex which the description of the interface needs to match"
        },
        component: {
            type: GraphQLID,
            description: "Filter for The ID of the component the inerface is offered by"
        },
        consumedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, only interfaces which are consumed by at least one of the components with the given ids can match the filter"
        }
    })
};
let GraphQLComponentInterfaceFilter = new GraphQLInputObjectType(componentInterfaceFilterConfig);
export default GraphQLComponentInterfaceFilter;