import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIssueCommentsCommand } from "../../../common/database/commands/load/nodes/timeline/LoadIssueCommentsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { IssueComment } from "../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../ResolverContext";
import GraphQLIssueCommentFilter from "../types/filters/GraphQLIssueCommentFilter";
import GraphQLIssueCommentPage from "../types/pages/GraphQLIssueCommentPage";
import syncNodeListQuery from "./syncNodeListQuery";

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
    const baseQuery = syncNodeListQuery<TSource, IssueComment>(GraphQLIssueCommentPage, GraphQLIssueCommentFilter, description, "issue comments", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssueCommentsCommand();
            baseQuery.addParams(cmd, args);
            cmd.onIssues = args.filterBy?.issue;
            cmd.editedBy = args.filterBy?.editedBy;
            cmd.lastEditedAfter = args.filterBy?.editedAfter;
            cmd.lastEditedBefore = args.filterBy?.editedBefore;
            cmd.body = args.filterBy?.body;
            cmd.reactions = args.filterBy?.reactions;
            /*
            if (typeof args.filterBy?.currentUserCanEdit === "boolean") {
                if (args.filterBy?.currentUserCanEdit) {
                    cmd.onComponents = context.user.permissions.filterComponent(permissions => permissions.editIssues || permissions.moderate || permissions.componentAdmin);
                } else {
                    cmd.onComponents = context.user.permissions.filterComponent(permissions => !(permissions.editIssues || permissions.moderate || permissions.componentAdmin));
                }
            }
            */
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default issueCommentsListQuery;
/*let issueComments: GraphQLFieldConfig<any, any, any> | undefined;
export default () => {
    if (issueComments === undefined) {
        issueComments = {
            type: GraphQLIssueCommentPage,
            description: "All comments for this issue, matching the given filter.\n" +
                "If no filter is given, all comments will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only comments AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only comments BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueCommentFilter,
                    description: "Return only comments matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n comments"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n comments"
                }
            }
        };
    }
    return issueComments;
};*/