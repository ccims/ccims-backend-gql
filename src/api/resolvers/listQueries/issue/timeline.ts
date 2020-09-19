import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLIssueTimelineItemPage from "../../types/pages/GraphQLIssueTimelineItemPage";
import GraphQLIssueTimelineItemFilter from "../../types/filters/GraphQLIssueTimelineItemFilter";
import { CCIMSNode } from "../../../../common/nodes/CCIMSNode";
import { IssueTimelineItem } from "../../../../common/nodes/timelineItems/IssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";
import syncNodeListQuery from "../syncNodeListQuery";
import { NodeListProperty } from "../../../../common/nodes/properties/NodeListProperty";
import { LoadIssueTimelineItemsCommand } from "../../../../common/database/commands/load/nodes/timeline/LoadIssueTimelineItemsCommand";

/**
 * Creates a timeline items query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the timeline items query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable timeline items query
 */
function timelineItemsCommentsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<IssueTimelineItem, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = syncNodeListQuery<TSource, IssueTimelineItem>(GraphQLIssueTimelineItemPage, GraphQLIssueTimelineItemFilter, description, "timeline items", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssueTimelineItemsCommand();
            baseQuery.addParams(cmd, args);
            cmd.types = args.filterBy?.type;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default timelineItemsCommentsListQuery;
/*let timeline: GraphQLFieldConfig<any, any, any> | undefined;
export default () => {
    if (timeline === undefined) {
        timeline = {
            type: GraphQLIssueTimelineItemPage,
            description: "All timeline events for this issue in chonological order from oldest to newest, matching the given filter.\n" +
                "If no filter is given, all events will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only timeline events AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only timeline events BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueTimelineItemFilter,
                    description: "Return only timeline events matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n timeline events"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n timeline events"
                }
            }
        };
    }
    return timeline;
};*/