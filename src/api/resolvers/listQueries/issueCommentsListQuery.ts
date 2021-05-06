import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIssueCommentsCommand } from "../../../common/database/commands/load/nodes/timeline/LoadIssueCommentsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { IssueComment } from "../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../ResolverContext";
import GraphQLIssueCommentFilter from "../types/filters/GraphQLIssueCommentFilter";
import GraphQLIssueCommentPage from "../types/pages/GraphQLIssueCommentPage";
import commentsListQuery from "./commentsListQuery";

/**
 * Creates a issue comments query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the issue comments query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable issue comments query
 */
function issueCommentsListQuery<TSource extends CCIMSNode, TProperty extends Partial<IssueComment>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<CCIMSNode & TProperty>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = commentsListQuery<TSource, IssueComment>(GraphQLIssueCommentPage, GraphQLIssueCommentFilter, description, "issue comments", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssueCommentsCommand();
            baseQuery.addParams(cmd, args);
            cmd.onIssues = args.filterBy?.issue;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default issueCommentsListQuery;