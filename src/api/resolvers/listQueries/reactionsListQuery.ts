import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";;
import syncNodeListQuery from "./syncNodeListQuery";
import { LoadReactionsCommand } from "../../../common/database/commands/load/nodes/LoadReactionsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ReactionGroup } from "../../../common/nodes/ReactionGroup";
import { ResolverContext } from "../../ResolverContext";
import GraphQLReactionGroupPage from "../types/pages/GraphQLReactionGroupPage";
import GraphQLReactionGroupFilter from "../types/filters/GraphQLReactionGroupFilter";

/**
 * Creates a reactions query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the reactions query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable reactions query
 */
function reactionsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<ReactionGroup, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = syncNodeListQuery<TSource, ReactionGroup>(GraphQLReactionGroupPage, GraphQLReactionGroupFilter, description, "reactions", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadReactionsCommand();
            baseQuery.addParams(cmd, args);
            cmd.users = args.filterBy?.users;
            cmd.reaction = args.filterBy?.reaction;
            return baseQuery.createResult(src, context, cmd);
        }
    };
};
export default reactionsListQuery;