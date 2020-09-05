import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLProjectPage from "../types/pages/GraphQLProjectPage";
import GraphQLProjectFilter from "../types/filters/GraphQLProjectFilter";
import { ResolverContext } from "../../ResolverContext";

let projects: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (projects === undefined) {
        projects = {
            type: GraphQLProjectPage,
            description: "Requests projects within the given limits",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Returns projects after the given edge"
                },
                before: {
                    type: GraphQLString,
                    description: "Returns projects before the given edge"
                },
                filterBy: {
                    type: GraphQLProjectFilter,
                    description: "Only projects matching this filter will be returned"
                },
                first: {
                    type: GraphQLInt,
                    description: "Only return the first _n_ projects in the system"
                },
                last: {
                    type: GraphQLInt,
                    description: "Only return the last _n_ projects in the system"
                }
            },
            resolve: (parent: any, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
                console.log(args);
                return { nodes: [{ name: JSON.stringify(context.dbManager) }] };
            }
        };
    }
    return projects;
};