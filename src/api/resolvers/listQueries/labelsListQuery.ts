import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLLabelPage from "../types/pages/GraphQLLabelPage";
import GraphQLLabelFilter from "../types/filters/GraphQLLabelFilter";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Label } from "../../../common/nodes/Label";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import namedSyncNodeListQuery from "./namedSyncNodeListQuery";
import { LoadLabelsCommand } from "../../../common/database/commands/load/nodes/LoadLabelsCommand";

/**
 * Creates a labels query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the labels query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable labels query
 */
function labelsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<Label, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = namedSyncNodeListQuery<TSource, Label>(GraphQLLabelPage, GraphQLLabelFilter, description, "labels", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadLabelsCommand();
            baseQuery.addParams(cmd, args);
            cmd.colors = args.filterBy?.color;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default labelsListQuery;
/*let labels: GraphQLFieldConfig<any, any, any> | undefined;
export default () => {
    if (labels === undefined) {
        labels = {
            type: GraphQLLabelPage,
            description: "All labels which are available on this project, matching the given filter.\n" +
                "If no filter is given, all labels will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only labels AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only labels BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLLabelFilter,
                    description: "Return only labels matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n labels"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n labels"
                }
            }
        }
    }
    return labels;
};*/