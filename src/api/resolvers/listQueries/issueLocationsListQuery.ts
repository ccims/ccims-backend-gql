import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLObjectType, GraphQLResolveInfo } from "graphql";
import { LoadIssueLocationsCommand } from "../../../common/database/commands/load/nodes/LoadIssueLocationsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IssueLocation } from "../../../common/nodes/IssueLocation";
import { ResolverContext } from "../../ResolverContext";
import nodeListQuery from "./nodeListQuery";
import GraphQLIssueLocationPage from "../types/pages/GraphQLIssueLocationPage";
import GraphQLIssueLocationFilter from "../types/filters/GraphQLIssueLocationFilter";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { listQueryType } from "./listQuery";
import namedSyncNodesListQuery, { NamedSyncNodeCommandFilterFields } from "./namedSyncNodesListQuery";

/**
 * necessary filter fields for syncNodeListQuery
 */
export interface IssueLocationCommandFilterFields extends NamedSyncNodeCommandFilterFields {
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
export function issueLocationsListQueryBase<TSource extends CCIMSNode, TNode extends IssueLocation>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): listQueryType<TSource, TNode, IssueLocationCommandFilterFields> {
    const baseQuery = namedSyncNodesListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNodeListCommand<TNode> & IssueLocationCommandFilterFields, args: any) => {
            baseQuery.addParams(cmd, args);
        }
    };
};


/**
 * Creates a IssueLocations query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the IssueLocations query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable IssueLocations query
 */
function issueLocationsListQuery<TSource extends CCIMSNode, TProperty extends Partial<IssueLocation>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = issueLocationsListQueryBase<TSource, IssueLocation>(GraphQLIssueLocationPage, GraphQLIssueLocationFilter, description, "IssueLocations", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssueLocationsCommand();
            cmd.name = args.filterBy?.name;
            cmd.description = args.filterBy?.description;
            baseQuery.addParams(cmd, args);
            return baseQuery.createResult(src, context, cmd);
        }
    };
};
export default issueLocationsListQuery;