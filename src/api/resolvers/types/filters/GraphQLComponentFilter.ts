import { GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import GraphQLIMSType from "../../enums/GraphQLIMSType";
import { issueLocationFilterFields } from "./GraphQLIssueLocationFilter";

const componentFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ComponentFilter",
    description: "Filters for component matching the given properties",
    fields: () => ({
        ...issueLocationFilterFields<Component>("Component"),
        repositoryURL: {
            type: GraphQLString,
            description: "The components repositoryURL must match the given __RegEx__"
        },
        imsType: {
            type: GraphQLList(GraphQLNonNull(GraphQLIMSType)),
            description: "The IMS type of a component must be one of the given ones"
        }
    })
};
const GraphQLComponentFilter = new GraphQLInputObjectType(componentFilterConfig);
export default GraphQLComponentFilter;