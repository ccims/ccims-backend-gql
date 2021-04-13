import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { SyncNode } from "../../../common/nodes/SyncNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { listQueryType } from "./listQuery";
import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import syncNodesListQuery, { SyncNodeCommandFilterFields } from "./syncNodesListQuery";
import { Comment } from "../../../common/nodes/Comment";

/**
 * necessary filter fields for commentsListQuery
 */
export interface CommentCommandFilterFields extends SyncNodeCommandFilterFields {
    editedBy: string[] | undefined,
    lastEditedAfter: Date | undefined,
    lastEditedBefore: Date | undefined,
    body: string | undefined,
    reactions: string[][] | undefined,
    currentUserCanEdit: boolean | undefined
}

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters (before/after/first/last)
 * as well as SyncNode filters and Comment filters
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
function commentsListQuery<TSource extends CCIMSNode, TNode extends Comment>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): listQueryType<TSource, TNode, CommentCommandFilterFields> {
    const baseQuery = syncNodesListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNodeListCommand<TNode> & CommentCommandFilterFields, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.body = args.filterBy?.body;
            cmd.editedBy = args.filterBy?.editedBy;
            cmd.lastEditedAfter = args.filterBy?.lastEditedAfter;
            cmd.lastEditedBefore = args.filterBy?.lastEditedBefore;
            cmd.reactions = args.filterBy?.reactions;
            cmd.currentUserCanEdit = args.filterBy?.currentUserCanEdit;
        }
    };
}

export default commentsListQuery;