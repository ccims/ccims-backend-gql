import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { SyncNode } from "../../../common/nodes/SyncNode";
import nodeListQuery from "./nodeListQuery";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { listQueryType } from "./listQuery";
import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";

/**
 * necessary filter fields for syncNodeListQuery
 */
export interface SyncNodeCommandFilterFields {
    createdBy: string[] | undefined,
    createdAfter: Date | undefined,
    createdBefore: Date | undefined
}

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters (before/after/first/last)
 * as well as the `createdBy` and `createdAt` filters
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
function syncNodesListQuery<TSource extends CCIMSNode, TNode extends SyncNode>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): listQueryType<TSource, TNode, SyncNodeCommandFilterFields> {
    const baseQuery = nodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNodeListCommand<TNode> & SyncNodeCommandFilterFields, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.createdBy = args.filterBy?.name;
            cmd.createdAfter = args.filterBy?.createdAfter;
            cmd.createdBefore = args.filterBy?.createdBefore;
        }
    };
};

export default syncNodesListQuery;