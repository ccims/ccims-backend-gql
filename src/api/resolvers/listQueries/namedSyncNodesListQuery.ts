import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NamedSyncNode } from "../../../common/nodes/NamedSyncNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { listQueryType } from "./listQuery";
import syncNodeListQuery, { SyncNodeCommandFilterFields } from "./syncNodesListQuery";

/**
 * necessary filter fields for namedSyncNodeListQuery
 */
export interface NamedSyncNodeCommandFilterFields extends SyncNodeCommandFilterFields {
    name: string | undefined,
    description: string | undefined,
    lastUpdatedAfter: Date | undefined,
    lastUpdatedBefore: Date | undefined
}

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters (before/after/first/last)
 * as well as the `name`, `description`, `createdBy` and `createdAt` filters
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
function namedSyncNodesListQuery<TSource extends CCIMSNode, TNode extends NamedSyncNode>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): listQueryType<TSource, TNode, NamedSyncNodeCommandFilterFields> {
    const baseQuery = syncNodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNodeListCommand<TNode> & NamedSyncNodeCommandFilterFields, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.name = args.filterBy?.name;
            cmd.description = args.filterBy?.description;
            cmd.lastUpdatedAfter = args.filterBy?.lastUpdatedAfter;
            cmd.lastUpdatedBefore = args.filterBy?.lastUpdatedBefore;
        }
    };
}

export default namedSyncNodesListQuery;