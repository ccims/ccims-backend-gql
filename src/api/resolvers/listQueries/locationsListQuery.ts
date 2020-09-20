import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIssueLocationsCommand } from "../../../common/database/commands/load/nodes/LoadIssueLocationsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IssueLocation } from "../../../common/nodes/IssueLocation";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import nodeListQuery from "./nodeListQuery";
import GraphQLIssueLocationPage from "../types/pages/GraphQLIssueLocationPage";
import GraphQLIssueLocationFilter from "../types/filters/GraphQLIssueLocationFilter";

/**
 * Creates a issue locations query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the issue locations query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable issue locations query
 */
function locationsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<IssueLocation, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, IssueLocation>(GraphQLIssueLocationPage, GraphQLIssueLocationFilter, description, "issue locations", propertyProvider);
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
export default locationsListQuery;

/*let locations: GraphQLFieldConfig<any, any, any> | undefined;
export default () => {
    if (locations === undefined) {
        locations = {
            type: GraphQLIssueLocationPage,
            description: "All locations this issue is assigned to, matching the given filter.\n" +
                "If no filter is given, all locations will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only locations AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only locations BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueLocationFilter,
                    description: "Return only locations matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n locations"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n locations"
                }
            }
        };
    }
    return locations;
};*/