import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadComponentsCommand } from "../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Component } from "../../../common/nodes/Component";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLComponentFilter from "../types/filters/GraphQLComponentFilter";
import GraphQLComponentPage from "../types/pages/GraphQLComponentPage";
import namedOwnedNodeListQuery from "./namedOwnedNodeListQuery";

export default <TSource extends CCIMSNode>(description: string, propertyProvider?: (node: TSource) => NodeListProperty<Component, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> => {
    const baseQuery = namedOwnedNodeListQuery<TSource, Component>(GraphQLComponentPage, GraphQLComponentFilter, description, "components", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadComponentsCommand();
            baseQuery.addParams(cmd, args);
            cmd.imsTypes = args.filterBy?.imsType;
            return baseQuery.createResult(src, context, cmd);
        }
    };
};