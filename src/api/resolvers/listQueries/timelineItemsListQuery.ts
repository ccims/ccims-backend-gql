import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IssueTimelineItem } from "../../../common/nodes/timelineItems/IssueTimelineItem";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import nodeListQuery from "./nodeListQuery";
import GraphQLIssueTimelineItemPage from "../types/pages/GraphQLIssueTimelineItemPage";
import GraphQLIssueTimelineItemFilter from "../types/filters/GraphQLIssueTimelineItemFilter";
import { LoadIssueTimelineItemsCommand } from "../../../common/database/commands/load/nodes/timeline/LoadIssueTimelineItemsCommand";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";


/**
 * Creates a timeline items query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the timeline items query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable timeline items query
 */
function timelineItemsListQuery<TSource extends CCIMSNode, TProperty extends Partial<IssueTimelineItem>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, IssueTimelineItem>(GraphQLIssueTimelineItemPage, GraphQLIssueTimelineItemFilter, description, "timeline items", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssueTimelineItemsCommand();
            baseQuery.addParams(cmd, args);
            cmd.createdBy = args.filterBy?.name;
            cmd.createdAfter = args.filterBy?.createdAfter;
            cmd.createdBefore = args.filterBy?.createdBefore;
            cmd.types = args.filterBy?.type;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default timelineItemsListQuery;