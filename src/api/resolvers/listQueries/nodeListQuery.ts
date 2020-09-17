import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { ResolverContext } from "../../ResolverContext";

export default (pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string):
    GraphQLFieldConfig<any, ResolverContext> & { addParams: (cmd: LoadNodeListCommand<any>, args: any) => any } => {
    return {
        type: pageType,
        description,
        args: {
            after: {
                type: GraphQLString,
                description: `Returns only ${nodeNamePlural} AFTER one with the given cursor (exclusive)`
            },
            before: {
                type: GraphQLString,
                description: `Returns only ${nodeNamePlural} BEFORE the one with the given cursor (exclusive)`
            },
            filterBy: {
                type: filterType,
                description: `Only ${nodeNamePlural} matching this filter will be returned`
            },
            first: {
                type: GraphQLInt,
                description: `Only return the first _n_ ${nodeNamePlural} matching the filter`
            },
            last: {
                type: GraphQLInt,
                description: `Only return the last _n_ ${nodeNamePlural} matching the filter`
            }
        },
        addParams: (cmd: LoadNodeListCommand<any>, args: any) => {
            cmd.afterId = args.after;
            cmd.beforeId = args.before;
            if (args.first) {
                cmd.first = true;
                cmd.limit = args.first;
            } else if (args.last) {
                cmd.first = false;
                cmd.limit = args.first;
            }
        }
    };
};