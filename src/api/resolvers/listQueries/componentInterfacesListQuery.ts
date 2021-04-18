import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import GraphQLComponentInterfacePage from "../types/pages/GraphQLComponentInterfacePage";
import GraphQLComponentInterfaceFilter from "../types/filters/GraphQLComponentInterfaceFilter";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ComponentInterface } from "../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../ResolverContext";
import { LoadComponentInterfacesCommand } from "../../../common/database/commands/load/nodes/LoadComponentInterfacesCommand";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { issueLocationsListQueryBase } from "./issueLocationsListQuery";

/**
 * Creates a interfaces query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the interfaces query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable interfaces query
 */
function componentInterfacesListQuery<TSource extends CCIMSNode, TProperty extends Partial<ComponentInterface>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = issueLocationsListQueryBase<TSource, ComponentInterface>(GraphQLComponentInterfacePage, GraphQLComponentInterfaceFilter, description, "ComponentInterfaces", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadComponentInterfacesCommand();
            baseQuery.addParams(cmd, args);
            cmd.onComponents = args.filterBy?.component;
            cmd.consumedByComponent = args.filterBy?.consumedBy;
            cmd.interfaceType = args.filterBy?.type;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default componentInterfacesListQuery;