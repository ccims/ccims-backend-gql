import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLIMSType from "../../enums/GraphQLIMSType";

const componentFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ComponentFilter",
    description: "Filters for component matching the given properties",
    fields: () => ({
        name: {
            type: GraphQLString,
            description: "The name of the component must match the given RegEx"
        },
        owner: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The owner of the component must have any of the given ids"
        },
        description: {
            type: GraphQLString,
            description: "The components description must match the given __RegEx__"
        },
        imsType: {
            type: GraphQLList(GraphQLNonNull(GraphQLIMSType)),
            description: "The IMS type of a component must be one of the given ones"
        }
    })
};
const GraphQLComponentFilter = new GraphQLInputObjectType(componentFilterConfig);
export default GraphQLComponentFilter;