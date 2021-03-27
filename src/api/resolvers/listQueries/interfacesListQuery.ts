import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLComponentInterfacePage from "../types/pages/GraphQLComponentInterfacePage";
import GraphQLComponentInterfaceFilter from "../types/filters/GraphQLComponentInterfaceFilter";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import namedNodeListQuery from "./namedNodeListQuery";
import { ComponentInterface } from "../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../ResolverContext";
import { LoadComponentInterfacesCommand } from "../../../common/database/commands/load/nodes/LoadComponentInterfacesCommand";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import namedSyncNodeListQuery from "./namedSyncNodeListQuery";

/**
 * Creates a interfaces query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the interfaces query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable interfaces query
 */
function interfacesListQuery<TSource extends CCIMSNode, TProperty extends Partial<ComponentInterface>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = namedSyncNodeListQuery<TSource, ComponentInterface>(GraphQLComponentInterfacePage, GraphQLComponentInterfaceFilter, description, "component interfaces", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadComponentInterfacesCommand();
            baseQuery.addParams(cmd, args);
            cmd.onComponents = args.filterBy?.component;
            cmd.consumedByComponent = args.filterBy?.consumedBy;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default interfacesListQuery;