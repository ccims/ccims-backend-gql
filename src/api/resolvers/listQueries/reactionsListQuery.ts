import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";;
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ReactionGroup } from "../../../common/nodes/ReactionGroup";
import { ResolverContext } from "../../ResolverContext";
import GraphQLReactionGroupPage from "../types/pages/GraphQLReactionGroupPage";
import GraphQLReactionGroupFilter from "../types/filters/GraphQLReactionGroupFilter";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import nodeListQuery from "./nodeListQuery";
import { LoadReactionGroupsCommand } from "../../../common/database/commands/load/nodes/LoadReactionGroupsCommand";

/**
 * Creates a reactions query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the reactions query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable reactions query
 */
function reactionsListQuery<TSource extends CCIMSNode, TProperty extends Partial<ReactionGroup>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, ReactionGroup>(GraphQLReactionGroupPage, GraphQLReactionGroupFilter, description, "reactions", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadReactionGroupsCommand();
            baseQuery.addParams(cmd, args);
            cmd.users = args.filterBy?.users;
            cmd.reaction = args.filterBy?.reaction;
            return baseQuery.createResult(src, context, cmd);
        }
    };
};
export default reactionsListQuery;