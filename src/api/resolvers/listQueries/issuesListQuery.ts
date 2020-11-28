import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLIssueFilter from "../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../types/pages/GraphQLIssuePage";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { Issue } from "../../../common/nodes/Issue";
import { ResolverContext } from "../../ResolverContext";
import syncNodeListQuery from "./syncNodeListQuery";
import { LoadIssuesCommand } from "../../../common/database/commands/load/nodes/LoadIssuesCommand";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";

/**
 * Creates a interfaces query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the interfaces query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable interfaces query
 */
function issuesListQuery<TSource extends CCIMSNode, TProperty extends Partial<Issue>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = syncNodeListQuery<TSource, Issue>(GraphQLIssuePage, GraphQLIssueFilter, description, "issues", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIssuesCommand();
            baseQuery.addParams(cmd, args);
            cmd.title = args.filterBy?.title;
            cmd.onComponents = args.filterBy?.component;
            cmd.body = args.filterBy?.body;
            cmd.fullSearch = args.filterBy?.fullSearch;
            cmd.editedBy = args.filterBy?.editedBy;
            cmd.lastEditedAfter = args.filterBy?.editedAfter;
            cmd.lastEditedBefore = args.filterBy?.editedBefore;
            cmd.updatedAfter = args.filterBy?.updatedAfter;
            cmd.updatedBefore = args.filterBy?.updatedBefore;
            cmd.isOpen = args.filterBy?.isOpen;
            cmd.isDuplicate = args.filterBy?.isDuplicate;
            cmd.ofCategory = args.filterBy?.category;
            cmd.linksToAnyIssues = args.filterBy?.linksIssues;
            cmd.linkedByAnyIssues = args.filterBy?.isLinkedByIssues;
            cmd.linksToIssues = args.filterBy?.linkedIssues;
            cmd.linkedByIssues = args.filterBy?.linkedByIssues;
            cmd.reactions = args.filterBy?.reactions;
            cmd.userAssigned = args.filterBy?.assignees;
            cmd.labels = args.filterBy?.labels;
            cmd.userParticipated = args.filterBy?.participants;
            cmd.onLocations = args.filterBy?.locations;
            cmd.currentUserCanEdit = args.filterBy?.currentUserCanEdit;
            cmd.currentUserCanComment = args.filterBy?.currentUserCanComment;
            cmd.startDateAfter = args.filterBy?.startDateAfter;
            cmd.startDateBefore = args.filterBy?.startDateBefore;
            cmd.dueDateAfter = args.filterBy?.dueDateAfter;
            cmd.dueDateBefore = args.filterBy?.dueDateBefore;
            cmd.estimatedTimeGreaterThan = args.filterBy?.estimatedTimeGreaterThan;
            cmd.estimatedTimeLowerThan = args.filterBy?.estimatedTimeLowerThan;
            cmd.spentTimeGreaterThan = args.filterBy?.spentTimeGreaterThan;
            cmd.spentTimeLowerThan = args.filterBy?.spentTimeLowerThan;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default issuesListQuery;