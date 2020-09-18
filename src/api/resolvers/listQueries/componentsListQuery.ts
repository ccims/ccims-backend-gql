import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadComponentsCommand } from "../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Component } from "../../../common/nodes/Component";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLComponentFilter from "../types/filters/GraphQLComponentFilter";
import GraphQLComponentPage from "../types/pages/GraphQLComponentPage";
import namedOwnedNodeListQuery from "./namedOwnedNodeListQuery";

/**
 * Creates a components query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the components query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable components query
 */
function componentsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<Component, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
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
}
export default componentsListQuery;